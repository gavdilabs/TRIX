import ResponsivePopover from "sap/m/ResponsivePopover";
import SinglePlanningCalendar from "sap/m/SinglePlanningCalendar";
import StandardTreeItem from "sap/m/StandardTreeItem";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import JSONModel from "sap/ui/model/json/JSONModel";
import CalendarAppointment from "sap/ui/unified/CalendarAppointment";
import TRIXCalendar from "../controls/TRIXCalendar";
import ApplicationModelHandler from "../dataHandlers/ApplicationModelHandler";
import DropDownHandler from "../dataHandlers/DropDownHandler";
import TimeRegistrationSetHandler from "../dataHandlers/TimeRegistrationSetHandler";
import { trix } from "../model/entities-core";
import BaseController from "./BaseController";

enum AppointmentPopoverMode {
	DRAGGED = "DRAGGED",
	SELECTED = "SELECTED",
	CELLPRESS = "CELLPRESS",
}

interface IPopupModel {
	mode: AppointmentPopoverMode;
	startDate: Date;
	endDate: Date;
	recordId: string;
	isTemporary: boolean;
}

/**
 * @namespace trix.timesheet.controller
 */
export default class Main extends BaseController {
	public readonly POPOVER_MODEL_NAME = "PopoverControl";

	private popoverAppointment: Control;
	private tempUiRecord: Partial<trix.core.ITimeRegistration> = undefined;
	private tempAppointmentControl: CalendarAppointment = undefined;
	private cellPressed: boolean = false;
	private ddHandler: DropDownHandler = undefined;

	/**
	 * UI5 Hook Function - Called once on initialization
	 */
	public onInit(): void {
		this.getRouter()
			.getRoute("main")
			.attachPatternMatched(() => {
				void this.onPatternMatched();
			}, this);
	}

	/**
	 * Routing target - only firing if url has /Main
	 */
	private async onPatternMatched() {
		//Initialize the Data handler(s)
		void (await TimeRegistrationSetHandler.initialize(
			this.getOdataModelCore(),
			this,
			this.getResourceBundle()
		));

		//ApplicationModelHandler init
		ApplicationModelHandler.getInstance().initialize(this);

		//Preload some popup lists
		this.ddHandler = new DropDownHandler(
			this,
			this.getOdataModelCore(),
			this.getResourceBundle()
		);

		//Preload the allocation tree data
		void (await this.ddHandler.loadAllocationTree());

		//Load last as other dependencies, formatter etc. need to use the ddhandler based on calendar data
		void (await TimeRegistrationSetHandler.getInstance().loadTimeRegistrations());
	}

	/**
	 * Function for gettting a ref to the Calendar Control
	 * @returns an instance of a TRIXCalendar UI Control
	 */
	private getCalendarControl(): SinglePlanningCalendar {
		return this.byId(this.createId("trixCalendar")) as TRIXCalendar;
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
		const calendarControl = this.getCalendarControl()
			.getAppointments()
			.find((elm) => elm.getKey() === id);

		if (isTemporary) {
			calendarControl.setColor("rgba(0, 0, 0, 0.5)");
		}

		return calendarControl;
	}

	/**
	 * Event: Creates a new Appointment
	 * @param event std. base event for UI5.
	 */
	public async onAppointmentCreate(
		event: Event,
		mode: AppointmentPopoverMode
	): Promise<void> {
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
			.getObject() as trix.core.ITimeAllocation;

		if (!this.popoverAppointment) {
			this.popoverAppointment = (await Fragment.load({
				id: this.getView().getId(),
				name: "trix.timesheet.view.popovers.PopoverAppointment",
				controller: this,
			})) as Control;

			if (this.popoverAppointment) {
				this.getView().addDependent(this.popoverAppointment);
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
				};

				popover.setModel(new JSONModel(data), this.POPOVER_MODEL_NAME);

				popover.openBy(openByControl as unknown as Control);
			};
			//To make sure the control has rendered - def. a problem locally
			window.setTimeout(openFunc, delayInMs);
		}
	}

	/**
	 * Event function that handles when the project popover closes
	 */
	public onAppointmentPopoverClose() {
		if (this.tempUiRecord?.ID) {
			TimeRegistrationSetHandler.getInstance().deleteDataMapItem(
				this.tempUiRecord.ID
			);
		}

		this.cellPressed = false;
	}

	/**
	 * Event Function for when selecting a Tree Project/allocation Item
	 * @param event Std. UI5 event
	 * @returns void
	 */
	public onAppointmentPopoverItemSelect(event: Event): void {
		const params = event.getParameters() as { listItem: StandardTreeItem };
		if (!params || !params.listItem) {
			return;
		}

		const selectedItemData = params.listItem
			.getBindingContext(DropDownHandler.MODELNAME_ALLOCATION_TREE)
			.getObject() as { key: string; text: string; isSelectable: boolean };

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
	 * Function for closing the appointment popover
	 */
	public closePopover() {
		(this.popoverAppointment as ResponsivePopover)?.close();
	}

	/**
	 * Formatter: Sets configured color on the appointments
	 * @param appointmentType Appointment typ ie. Service, Absence, Attendance etc.
	 * @param appointmentSubtypeId Id of the subtype
	 * @returns color #hex
	 */
	public formatterAppointmentColor(
		appointmentType: trix.core.AllocationType,
		appointmentSubtypeId: string
	) {
		switch (appointmentType) {
			case trix.core.AllocationType.AbsenceAttendance:
				return ApplicationModelHandler.getInstance().getColorByAllocationType(
					appointmentType,
					this.ddHandler?.isSubtypeAttendance(
						appointmentType,
						appointmentSubtypeId
					)
				);
			default:
				return ApplicationModelHandler.getInstance().getColorByAllocationType(
					appointmentType
				);
		}
	}

	/**
	 * Event function for when an exisiting appointment is resized
	 * @param event std. ui5 event
	 */
	public onAppointmentResize(event: Event) {
		//TODO: Not implemented yet - also needs the xml param =true to enable
		console.log(event.getParameters());
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
	}

	public async onSaveAppointmentChanges(): Promise<void> {
		const data = (
			this.popoverAppointment.getModel(this.POPOVER_MODEL_NAME) as JSONModel
		).getData() as IPopupModel;

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
			newEndDate
		));

		this.closePopover();
	}

	public onToggleFullDay(event: Event) {
		const params = event.getParameters() as { pressed: boolean };
		this.getCalendarControl().setFullDay(params.pressed);
	}

	public async onDeleteAppointment() {
		const data = (
			this.popoverAppointment.getModel(this.POPOVER_MODEL_NAME) as JSONModel
		).getData() as IPopupModel;

		void (await TimeRegistrationSetHandler.getInstance().deleteTimeRegistration(
			{
				ID: data.recordId,
			}
		));

		this.closePopover();
	}
}
