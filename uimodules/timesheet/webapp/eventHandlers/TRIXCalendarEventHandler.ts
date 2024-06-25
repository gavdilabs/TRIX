import ResponsivePopover from "sap/m/ResponsivePopover";
import StandardTreeItem from "sap/m/StandardTreeItem";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import CalendarAppointment from "sap/ui/unified/CalendarAppointment";
import TRIXCalendar from "../controls/TRIXCalendar";
import ApplicationModelHandler, {
	CalendarView,
} from "../dataHandlers/ApplicationModelHandler";
import DropDownHandler from "../dataHandlers/DropDownHandler";
import TimeRegistrationSetHandler from "../dataHandlers/TimeRegistrationSetHandler";
import { trix } from "../model/entities-core";
import { ITimeRegistrationAndAllocation } from "../model/interfaces";
import { AppointmentPopoverMode, ICalendarEventHandler } from "./EventTypes";

/**
 * Interface(Inner) for controllering the data selected in the appointment popover
 */
interface IPopupModel {
	mode: AppointmentPopoverMode;
	allocationId?: string;
	allocationDescription?: string;
	startDate: Date;
	endDate: Date;
	recordId: string;
	isTemporary: boolean;
}

/**
 * Implementation of the ICalendarEventHandler interface - to support modularization of event impl. into sep class to avoid controller flooding etc.
 */
export default class TRIXCalendarEventHandler implements ICalendarEventHandler {
	private controller: Controller = undefined;
	private cellPressed: boolean = false;
	private tempUiRecord: Partial<trix.core.ITimeRegistration> = undefined;
	private tempAppointmentControl: CalendarAppointment = undefined;
	private popoverAppointment: Control;
	private calendar: TRIXCalendar = undefined;
	public readonly POPOVER_MODEL_NAME = "PopoverControl";

	constructor(controller: Controller, calendar: TRIXCalendar) {
		this.controller = controller;
		this.calendar = calendar;
	}

	/**
	 * Event function for when we move an appointment around and drop it
	 * @param event std. ui5 event
	 */
	public async onAppointmentDrop(event: Event): Promise<void> {
		const parameters = event.getParameters() as {
			appointment: CalendarAppointment;
			startDate: Date;
			endDate: Date;
		};

		//Update the record in DB
		void (await TimeRegistrationSetHandler.getInstance().updateAppointment(
			parameters.appointment,
			parameters.startDate,
			parameters.endDate
		));

		return;
	}

	/**
	 * Event function for when a Cell is pressed
	 * @param event std. ui5 event
	 * @param mode param 2 of event to specify which mode we are in
	 */
	public async onCellPress(event: Event, mode: AppointmentPopoverMode) {
		if (!this.cellPressed) {
			this.cellPressed = true;
			void (await this.onAppointmentCreate(event, mode));
		}
	}

	/**
	 * Event: Creates a new Appointment
	 * @param event std. base event for UI5.
	 */
	public async onAppointmentCreate(
		event: Event,
		mode: AppointmentPopoverMode
	): Promise<void> {
		//Check if we should allow registering
		if (!this.canRegister()) {
			return;
		}

		const parameters = event.getParameters() as {
			startDate: Date;
			endDate: Date;
			id: string;
		};

		this.tempUiRecord =
			TimeRegistrationSetHandler.getInstance().createTemporaryAppointMent(
				parameters.startDate,
				parameters.endDate
			);

		const appointmentControl = this.getCalendarAppointmentById(
			this.tempUiRecord.ID,
			true
		);
		if (appointmentControl) {
			void (await this.openAppointmentDialogByControl(
				appointmentControl,
				mode,
				200
			));
		}
	}

	/**
	 * Event function for when an exisiting appointment is resized
	 * @param event std. ui5 event
	 */
	public async onAppointmentResize(
		event: Event,
		mode: AppointmentPopoverMode
	): Promise<void> {
		console.log(mode, event.getParameters());
		const parameters = event.getParameters() as {
			appointment: CalendarAppointment;
			startDate: Date;
			endDate: Date;
		};

		//Update the record in DB
		void (await TimeRegistrationSetHandler.getInstance().updateAppointment(
			parameters.appointment,
			parameters.startDate,
			parameters.endDate
		));

		return;
	}

	/**
	 * Event function that handles when the project popover closes
	 */
	public onAppointmentPopoverClose() {
		if (
			this.tempUiRecord?.ID &&
			TimeRegistrationSetHandler.isTempItemId(this.tempUiRecord.ID)
		) {
			TimeRegistrationSetHandler.getInstance().deleteDataMapItem(
				this.tempUiRecord.ID
			);
		}

		this.cellPressed = false;
	}

	/**
	 * Function for getting a specific UI Appointment control in the Calendar
	 * @param id id = KEY of the control element to fetch
	 * @returns CalendarAppointment or null
	 */
	private getCalendarAppointmentById(
		id: string,
		isTemporary: boolean = false
	): CalendarAppointment {
		const calendarControl = this.calendar
			.getAppointments()
			.find((elm) => elm.getKey() === id);

		if (isTemporary) {
			calendarControl.setColor("rgba(0, 0, 0, 0.5)");
		}

		return calendarControl;
	}

	/**
	 * Function that evaluates based on current states/data if registrations should be allowed
	 * @returns boolean true | false
	 */
	public canRegister(): boolean {
		//For now we do not support registrations on Month View - makes little sense.
		if (
			ApplicationModelHandler.getInstance().getCurrentCalendarView() ===
			CalendarView.MONTH
		) {
			return false;
		}

		return true;
	}

	/**
	 * Function for opening the Time Registration
	 * @param openByControl UI Control to link the popover to
	 * @param mode Which mode popup is in
	 * @param delayInMs MS number (default 0) to wait before opening the popover
	 */
	public async openAppointmentDialogByControl(
		openByControl: CalendarAppointment,
		mode: AppointmentPopoverMode,
		delayInMs: number = 0
	): Promise<void> {
		//Set the global for return events to use
		this.tempAppointmentControl = openByControl;

		const appointmentData = openByControl
			.getBindingContext("PeriodRegistrations")
			.getObject() as ITimeRegistrationAndAllocation;

		this.tempUiRecord = appointmentData;

		if (!this.popoverAppointment) {
			this.popoverAppointment = (await Fragment.load({
				id: this.controller.getView().getId(),
				name: "trix.timesheet.view.popovers.PopoverAppointment",
				controller: this,
			})) as Control;

			if (this.popoverAppointment) {
				this.controller.getView().addDependent(this.popoverAppointment);
			}
		}

		if (openByControl && this.popoverAppointment) {
			const openFunc = () => {
				const popover = this.popoverAppointment as ResponsivePopover;

				const data: IPopupModel = {
					mode: mode,
					startDate: openByControl.getStartDate() as Date,
					endDate: openByControl.getEndDate() as Date,
					isTemporary:
						appointmentData?.ID?.indexOf("TEMP") === 0 ? true : false,
					recordId: appointmentData?.ID,
					allocationId: appointmentData?.allocation?.ID,
					allocationDescription: appointmentData?.allocation?.description,
				};

				popover.setModel(new JSONModel(data), this.POPOVER_MODEL_NAME);

				popover.openBy(openByControl as unknown as Control);
			};
			//To make sure the control has rendered - def. a problem locally
			window.setTimeout(openFunc, delayInMs);
		}
	}

	/**
	 * Event Function for when selecting a Tree Project/allocation Item
	 * @param event Std. UI5 event
	 * @returns void
	 */
	public onAppointmentPopoverItemSelect(event: Event): void {
		const popoverData = this.getPopoverModelData();
		const params = event.getParameters() as { listItem: StandardTreeItem };

		if (!params || !params.listItem) {
			return;
		}

		const selectedItemData = params.listItem
			.getBindingContext(DropDownHandler.MODELNAME_ALLOCATION_TREE)
			.getObject() as { key: string; text: string; isSelectable: boolean };

		//Update the selected item key in popover model
		this.setPopoverModelDataProperty("/allocationId", selectedItemData.key);

		//If we are in SELECTD mode we abort here - we dont want the popup to close and create item
		if (popoverData?.mode === AppointmentPopoverMode.SELECTED) {
			return;
		}

		//No data or non-selectable project
		if (!selectedItemData || selectedItemData.isSelectable === false) {
			return;
		}

		//add allocation Id to the tempUiRecord data
		this.tempUiRecord.allocation_ID = selectedItemData.key;

		//Commit the record to th backend DB
		void TimeRegistrationSetHandler.getInstance().createAppointmentBackend(
			this.tempAppointmentControl.getStartDate() as Date,
			this.tempAppointmentControl.getEndDate() as Date,
			this.tempUiRecord
		);

		this.closePopover();
	}

	/**
	 * Event function for when an exisitng appointment is selected
	 * @param event
	 */
	public async onAppointmentSelect(event: Event) {
		const params = event.getParameters() as {
			appointment: CalendarAppointment;
		};
		if (params && params.appointment) {
			void (await this.openAppointmentDialogByControl(
				params.appointment,
				AppointmentPopoverMode.SELECTED
			));
		}
	}

	/**
	 * Function for closing the appointment popover
	 */
	public closePopover() {
		(this.popoverAppointment as ResponsivePopover)?.close();
	}

	/**
	 * Event function for when save is clicked in the appointment popover
	 */
	public async onSaveAppointmentChanges(): Promise<void> {
		const data = this.getPopoverModelData();

		//We use the below ref dates for stability as the timepickers may go 1970.01.01
		const newStartDate: Date =
			this.tempAppointmentControl.getStartDate() as Date;
		const newEndDate: Date = this.tempAppointmentControl.getEndDate() as Date;

		newStartDate.setHours(data.startDate.getHours());
		newStartDate.setMinutes(data.startDate.getMinutes());
		newEndDate.setHours(data.endDate.getHours());
		newEndDate.setMinutes(data.endDate.getMinutes());

		//Update the record in DB
		void (await TimeRegistrationSetHandler.getInstance().updateAppointment(
			this.tempAppointmentControl,
			newStartDate,
			newEndDate,
			data.allocationId
		));

		this.closePopover();
	}

	/**
	 * Function that handles the deletion of an appointment
	 */
	public async onDeleteAppointment() {
		const data = this.getPopoverModelData();

		void (await TimeRegistrationSetHandler.getInstance().deleteTimeRegistration(
			{
				ID: data.recordId,
			}
		));

		this.closePopover();
	}

	/**
	 * Conv. function to get easy access to the current popover model data
	 * @returns IPopupModel data structure
	 */
	public getPopoverModelData(): IPopupModel {
		return (
			this.popoverAppointment.getModel(this.POPOVER_MODEL_NAME) as JSONModel
		).getData() as IPopupModel;
	}

	/**
	 * Set a property value in the PopoverModel
	 * @param propName property name to set
	 * @param value value to set
	 */
	public setPopoverModelDataProperty(
		propName: string,
		value: string | number | boolean | object
	): void {
		if (!propName) {
			return;
		}

		propName = propName[0] === "/" ? propName : `/${propName}`;

		const model = this.popoverAppointment.getModel(
			this.POPOVER_MODEL_NAME
		) as JSONModel;
		if (model) {
			model.setProperty(propName, value);
		}
	}
}
