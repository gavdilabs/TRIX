import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { trix } from "../model/entities-core";
import {
	DeepPartial,
	ITimeRegistrationAndAllocation,
} from "../model/interfaces";
import ModelDataHelper from "../utils/ModelDataHelper";
import { OdataListbindingWrapper } from "../utils/OdataListbindingWrapper";

export default class TimeRegistrationSetHandler {
	public static readonly REGISTRATIONS_MODEL_NAME = "PeriodRegistrations";

	private static instance: TimeRegistrationSetHandler = undefined;
	private static odataModel: ODataModel = undefined;
	private static controller: Controller = undefined;

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

	public static initialize(odataModel: ODataModel, controller: Controller) {
		TimeRegistrationSetHandler.odataModel = odataModel;
		TimeRegistrationSetHandler.controller = controller;

		//Create the listbinding for backend
		const oBinding = odataModel.bindList(
			"/TimeRegistrationSet",
			undefined,
			undefined,
			undefined,
			{}
		);
		TimeRegistrationSetHandler.timeRegistrations = new OdataListbindingWrapper(
			oBinding,
			["ID"]
		);
	}

	/**
	 * Function that returns the JSON model with the current data displayed
	 * @returns
	 */
	private getAppointmentsModel(): JSONModel {
		return TimeRegistrationSetHandler.controller
			.getView()
			.getModel(
				TimeRegistrationSetHandler.REGISTRATIONS_MODEL_NAME
			) as JSONModel;
	}

	/**
	 * Call this to create a new appointment in the UI only.
	 * @param startDate
	 * @param endDate
	 * @returns
	 */
	public createAppointMentUI(
		startDate: Date,
		endDate: Date
	): Partial<trix.core.ITimeRegistration> {
		const existingData = this.getAppointmentsModel()?.getData() as DeepPartial<
			ITimeRegistrationAndAllocation[]
		>;

		//Update the UI
		const newItemUI: Partial<ITimeRegistrationAndAllocation> = {
			ID: `TEMP#${this.uniqueId()}`,
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
		existingData.push(newItemUI);
		this.updateData(existingData);

		return newItemUI;
	}

	private uniqueId(length = 16): string {
		return Math.ceil(Math.random() * Date.now())
			.toPrecision(length)
			.toString()
			.replace(".", "");
	}

	public async createAppointmentBackend(
		startDate: Date,
		endDate: Date,
		data: Partial<trix.core.ITimeRegistration>
	): Promise<void> {
		//Create the record in DB
		await TimeRegistrationSetHandler.timeRegistrations.createItem({
			startDate: startDate?.toISOString().split("T")[0] as unknown as Date, //Workaround hack to be abl
			endDate: endDate?.toISOString().split("T")[0] as unknown as Date,
			startTime: startDate?.toTimeString().split(" ")[0] as unknown as Date,
			endTime: endDate?.toTimeString().split(" ")[0] as unknown as Date,
			...data,
		});
	}

	public async loadTimeRegistrations(): Promise<void> {
		let timeRegistrationsForPeriod = await ModelDataHelper.getModelData<
			ITimeRegistrationAndAllocation[]
		>(TimeRegistrationSetHandler.odataModel, "/TimeRegistrationSet", {
			$expand: "allocation",
		});

		timeRegistrationsForPeriod = timeRegistrationsForPeriod.filter(
			(item) => item.startDate && item.endDate
		);

		timeRegistrationsForPeriod.forEach((item) => {
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
		});

		this.updateData(timeRegistrationsForPeriod);
	}

	private updateData(
		data:
			| ITimeRegistrationAndAllocation[]
			| Partial<ITimeRegistrationAndAllocation>[]
			| DeepPartial<ITimeRegistrationAndAllocation>[]
	) {
		TimeRegistrationSetHandler.controller
			.getView()
			.setModel(
				new JSONModel(data),
				TimeRegistrationSetHandler.REGISTRATIONS_MODEL_NAME
			);
	}
}
