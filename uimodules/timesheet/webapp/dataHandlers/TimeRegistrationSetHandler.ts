import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import MessageType from "sap/ui/core/message/MessageType";
import Controller from "sap/ui/core/mvc/Controller";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import JSONModel from "sap/ui/model/json/JSONModel";
import Context from "sap/ui/model/odata/v4/Context";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import CalendarAppointment from "sap/ui/unified/CalendarAppointment";
import { trix } from "../model/entities-core";
import { ITimeRegistrationAndAllocation } from "../model/interfaces";
import DateHelper from "../utils/DateHelper";
import { OdataListbindingWrapper } from "../utils/OdataListbindingWrapper";
import { CalendarView } from "./ApplicationModelHandler";
import DropDownHandler from "./DropDownHandler";

/**
 * Main data handler for TimeRegistrations. CRUD operations and storing into local JSON models after post processing.
 */
export default class TimeRegistrationSetHandler {
	public static readonly REGISTRATIONS_MODEL_NAME = "PeriodRegistrations";
	public static readonly REGISTRATIONS_GROUP_ID: string = undefined;

	private static instance: TimeRegistrationSetHandler = undefined;
	private static odataModel: ODataModel = undefined;
	private static controller: Controller = undefined;
	private static i18nBundle: ResourceBundle = undefined;
	private static startDate: Date = undefined;
	private static endDate: Date = undefined;

	private static dataMap: Map<string, Partial<ITimeRegistrationAndAllocation>> =
		new Map();

	private static timeRegistrations: OdataListbindingWrapper<
		Partial<trix.core.ITimeRegistration>
	> = undefined;

	public static getInstance(): TimeRegistrationSetHandler {
		if (
			!TimeRegistrationSetHandler.odataModel ||
			!TimeRegistrationSetHandler.controller
		) {
			throw new Error(
				"Cannot create instance w/o initialize() having been called first"
			);
		}

		if (!TimeRegistrationSetHandler.instance) {
			TimeRegistrationSetHandler.instance = new TimeRegistrationSetHandler();
		}

		return TimeRegistrationSetHandler.instance;
	}

	/**
	 * Call this once before main use to init the singleton
	 * @param odataModel OData V4 model
	 * @param controller UI controller
	 * @param i18nBundle i18n Resource Bundle for translations
	 * @param inputDate Date to start from
	 * @param navMode CalendarView Week / Month etc.
	 */
	public static async initialize(
		odataModel: ODataModel,
		controller: Controller,
		i18nBundle: ResourceBundle,
		inputDate: Date,
		navMode: CalendarView
	): Promise<void> {
		TimeRegistrationSetHandler.odataModel = odataModel;
		TimeRegistrationSetHandler.controller = controller;
		this.i18nBundle = i18nBundle;

		//Update the dates
		void TimeRegistrationSetHandler.updateDatesAndMode(
			inputDate,
			navMode,
			false
		);

		//Create the listbinding for backend
		const oBinding = odataModel.bindList(
			"/TimeRegistrationSet",
			undefined,
			undefined,
			new Filter("startDate", FilterOperator.NE, null),
			{ $$updateGroupId: this.REGISTRATIONS_GROUP_ID, $expand: "allocation" }
		);
		TimeRegistrationSetHandler.timeRegistrations = new OdataListbindingWrapper(
			oBinding,
			["allocation_ID"]
		);

		void (await TimeRegistrationSetHandler.timeRegistrations.refreshBinding());
	}

	/**
	 * Function to get a specific appointment context by its id
	 * @param id Appointment id
	 * @returns Context from the listBinding
	 */
	private async getAppointmentContext(id: string): Promise<Context> {
		const contexts: Context[] =
			await TimeRegistrationSetHandler.timeRegistrations.getContexts();
		const context = contexts.find(
			(ctxTmp) => (ctxTmp.getObject() as trix.core.ITimeRegistration).ID === id
		);
		return context;
	}

	/**
	 * Function that will update an appointment in the backend service
	 * @param appointment appointment UI control
	 * @param newStartDate new starting date
	 * @param newEndDate new ending date
	 * @param newAllocationId new allocation id if set (optional)
	 */
	public async updateAppointment(
		appointment: CalendarAppointment,
		newStartDate: Date,
		newEndDate: Date,
		newAllocationId?: string
	): Promise<void> {
		const timeRegData: trix.core.ITimeRegistration = appointment
			?.getBindingContext(TimeRegistrationSetHandler.REGISTRATIONS_MODEL_NAME)
			.getObject() as trix.core.ITimeRegistration;
		try {
			timeRegData.startDate = newStartDate;
			timeRegData.endDate = newEndDate;

			//Prepare Map item
			const mapItem: Partial<ITimeRegistrationAndAllocation> = {
				...timeRegData,
			};

			//Update the record in DB
			const startDateStr: string = DateHelper.dateAsSimpleFormat(newStartDate);
			const startTimeStr: string =
				DateHelper.dateAsSimpleTimeFormat(newStartDate);
			const endDateStr: string = DateHelper.dateAsSimpleFormat(newEndDate);
			const endTimeStr: string = DateHelper.dateAsSimpleTimeFormat(newEndDate);

			const existingContext = await this.getAppointmentContext(timeRegData.ID);
			void (await existingContext?.setProperty(
				`${existingContext.getPath()}/startDate`,
				startDateStr
			));
			void (await existingContext?.setProperty(
				`${existingContext.getPath()}/startTime`,
				startTimeStr
			));

			void (await existingContext?.setProperty(
				`${existingContext.getPath()}/endDate`,
				endDateStr
			));
			void (await existingContext?.setProperty(
				`${existingContext.getPath()}/endTime`,
				endTimeStr
			));
			if (newAllocationId) {
				void (await existingContext?.setProperty(
					`${existingContext.getPath()}/allocation_ID`,
					newAllocationId
				));
				mapItem.allocation_ID = newAllocationId;
				mapItem.allocation = this.getAllocationById(newAllocationId);
			}
			
			mapItem.startDate = newStartDate;
			mapItem.endDate = newEndDate;
			TimeRegistrationSetHandler.dataMap.set(timeRegData.ID, mapItem);

			this.updateUIModel();

			this.toast("MessageAppointmentUpdatedOk");
		} catch (e) {
			this.message(
				TimeRegistrationSetHandler.i18nBundle.getText(
					"MessageAppointmentUpdatedFail"
				),
				MessageType.Error
			);
		}
	}

	/**
	 * For new creations ids have a TEMP indicator. This function will determin if an item is TEMP by its ID
	 * @param id Id string to check
	 * @returns boolean true | false
	 */
	public static isTempItemId(id: string): boolean {
		return id && id.indexOf("TEMP#") > -1;
	}

	/**
	 * Call this to create a new appointment in the UI only.
	 * @param startDate
	 * @param endDate
	 * @returns
	 */
	public createTemporaryAppointMent(
		startDate: Date,
		endDate: Date
	): Partial<trix.core.ITimeRegistration> {
		//Create the new UI element
		const itemID = `TEMP#${this.uniqueId()}`;
		const newTempItem: Partial<ITimeRegistrationAndAllocation> = {
			ID: itemID,
			startDate: startDate,
			endDate: endDate,
			startTime: startDate,
			endTime: endDate,
			wholeDay: false,
			amount: 0,
			registrationStatus: 2,
			registrationType: 0,
			comment: "",
			invalid: false,
			statusContext: null,
			recordStatus: 2,
			user_userID: "TAG",
		};
		TimeRegistrationSetHandler.dataMap.set(itemID, newTempItem);
		this.updateUIModel();

		return newTempItem;
	}

	/**
	 * Tooling for getting a uuid
	 * @param length 16 in length - default
	 * @returns uuid
	 */
	private uniqueId(length = 16): string {
		return Math.ceil(Math.random() * Date.now())
			.toPrecision(length)
			.toString()
			.replace(".", "");
	}

	/**
	 * Creates an item in the backend
	 * @param startDate start date for the appointment
	 * @param endDate end date for the appointment
	 * @param appointmentData main payload for the appointment
	 */
	public async createAppointmentBackend(
		startDate: Date,
		endDate: Date,
		appointmentData: Partial<trix.core.ITimeRegistration>
	): Promise<void> {
		const tempId: string = appointmentData.ID;
		delete appointmentData.ID;

		//Create the record in DB
		const newItemFromBackendContext =
			await TimeRegistrationSetHandler.timeRegistrations.createItem({
				...appointmentData,
				startDate: DateHelper.dateAsSimpleFormat(startDate) as unknown as Date, //Workaround hack to cast it
				endDate: DateHelper.dateAsSimpleFormat(endDate) as unknown as Date,
				startTime: DateHelper.dateAsSimpleTimeFormat(
					startDate
				) as unknown as Date,
				endTime: DateHelper.dateAsSimpleTimeFormat(endDate) as unknown as Date,
			});

		try {
			//Add the DB Record to the data map
			void (await newItemFromBackendContext.created());

			//Reload the screen data
			void this.loadTimeRegistrations();

			//Delete the temp id item - will update the model automatically
			this.deleteDataMapItem(tempId);

			this.toast("MessageAppointmentCreatedOk");
		} catch {
			this.message("MessageAppointmentCreateFail", MessageType.Error);
		}
	}

	/**
	 * Function to delete a specific item from the dataMap
	 * @param itemId id to delete
	 * @param skipUpdate Default false, flag to skip the model update.
	 */
	public deleteDataMapItem(itemId: string, skipUpdate: boolean = false) {
		//Remove the temp record
		TimeRegistrationSetHandler.dataMap.delete(itemId);

		if (skipUpdate === false) {
			this.updateUIModel();
		}
	}

	/**
	 * Function delete remote db item
	 * @param timeData
	 */
	public async deleteTimeRegistration(
		timeData: Partial<trix.core.ITimeRegistration>
	): Promise<void> {
		if (!timeData || !timeData.ID) {
			return;
		}
		const contextToDelete = await this.getAppointmentContext(timeData.ID);

		try {
			if (contextToDelete) {
				await contextToDelete.delete();
			}
			this.deleteDataMapItem(timeData.ID);
			this.toast("MessageAppointmentDeletedOk");
		} catch (e) {
			this.message("MessageAppointmentDeletedFail", MessageType.Error);
		}
	}

	/**
	 * Show a toast message
	 * @param messageId i18n key
	 */
	private toast(messageId: string) {
		MessageToast.show(TimeRegistrationSetHandler.i18nBundle.getText(messageId));
	}

	/**
	 * Show a popup message
	 * @param messageId i18n key
	 * @param type error | warning | info | success 
	 */
	private message(messageId: string, type: MessageType) {
		const message = TimeRegistrationSetHandler.i18nBundle.getText(messageId);
		switch (type) {
			case MessageType.Error:
				MessageBox.error(message);
				break;
			case MessageType.Warning:
				MessageBox.warning(message);
				break;
			case MessageType.Information:
				MessageBox.information(message);
				break;
			case MessageType.Success:
				MessageBox.success(message);
				break;
			default:
				MessageBox.show(message);
				break;
		}
	}

	/**
	 * Function to externally/internally set the current key dat for the Calendar View and refresh data if flag is not disabled
	 * @param inputDate Key date to read data from
	 * @param navMode CalendarView Week | Month | Day
	 * @param reload default = true. Shoudl reload data after setting.?
	 */
	public static async updateDatesAndMode(
		inputDate: Date,
		navMode: CalendarView,
		reload: boolean = true
	) {
		[TimeRegistrationSetHandler.startDate, TimeRegistrationSetHandler.endDate] =
			DateHelper.getStartEndDates(inputDate, navMode);

		if (reload) {
			await TimeRegistrationSetHandler.getInstance().loadTimeRegistrations();
		}
	}

	/**
	 * Function that initially loads timeregistrations into map
	 */
	public async loadTimeRegistrations(): Promise<void> {
		const dateFilters: Filter[] = [
			new Filter(
				"startDate",
				FilterOperator.GE,
				DateHelper.dateAsSimpleFormat(TimeRegistrationSetHandler.startDate)
			),
			new Filter(
				"endDate",
				FilterOperator.LE,
				DateHelper.dateAsSimpleFormat(TimeRegistrationSetHandler.endDate)
			),
		];
		void (await TimeRegistrationSetHandler.timeRegistrations.refreshBinding(
			dateFilters
		));
		let timeRegistrationsForPeriod =
			await TimeRegistrationSetHandler.timeRegistrations.getContexts();

		timeRegistrationsForPeriod = timeRegistrationsForPeriod.filter((ctx) => {
			const itemData = ctx.getObject() as trix.core.ITimeRegistration;
			return itemData.startDate && itemData.endDate;
		});

		timeRegistrationsForPeriod.forEach((ctx) => {
			const item = ctx.getObject() as trix.core.ITimeRegistration;
			//Setup the startdate
			let [hour, minute, second] = (item.startTime as unknown as string).split(
				":"
			);
			item.startDate = new Date(item.startDate);
			item.startDate.setHours(parseInt(hour));
			item.startDate.setMinutes(parseInt(minute));
			item.startDate.setSeconds(parseInt(second));

			//Setup the enddate
			[hour, minute, second] = (item.endTime as unknown as string).split(":");
			item.endDate = new Date(item.endDate);
			item.endDate.setHours(parseInt(hour));
			item.endDate.setMinutes(parseInt(minute));
			item.endDate.setSeconds(parseInt(second));

			//Add to the map
			TimeRegistrationSetHandler.dataMap.set(item.ID, item);
		});

		this.updateUIModel();
	}

	/**
	 * This will inflate the items into
	 */
	private updateUIModel() {
		TimeRegistrationSetHandler.controller
			.getView()
			.setModel(
				new JSONModel(Array.from(TimeRegistrationSetHandler.dataMap.values())),
				TimeRegistrationSetHandler.REGISTRATIONS_MODEL_NAME
			);
	}

	/**
	 * Return a TimeAllocation object structure from a given timeAllocation id
	 * @param allocationId Allocation Id
	 * @returns TimeAllocation data
	 */
	private getAllocationById(allocationId: string): trix.core.ITimeAllocation {
		const allocationData = (
			TimeRegistrationSetHandler.controller
				.getView()
				.getModel(DropDownHandler.MODELNAME_ALLOCATION_SUB_TYPES) as JSONModel
		).getData() as trix.core.ITimeAllocation[];
		if (allocationData) {
			return allocationData.find((itemTmp) => itemTmp.ID === allocationId);
		} else {
			return undefined;
		}
	}
}
