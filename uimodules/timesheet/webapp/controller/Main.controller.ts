import ResponsivePopover from "sap/m/ResponsivePopover";
import SinglePlanningCalendar from "sap/m/SinglePlanningCalendar";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import CalendarAppointment from "sap/ui/unified/CalendarAppointment";
import TRIXCalendar from "../controls/TRIXCalendar";
import TimeRegistrationSetHandler from "../dataHandlers/TimeRegistrationSetHandler";
import BaseController from "./BaseController";

/**
 * @namespace trix.timesheet.controller
 */
export default class Main extends BaseController {
	private popoverAppointment: Control;

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
		TimeRegistrationSetHandler.initialize(this.getOdataModelCore(), this);

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
	private getCalndarAppointmentById(id: string): CalendarAppointment {
		return this.getCalendarControl()
			.getAppointments()
			.find((elm) => elm.getKey() === id);
	}

	/**
	 * Event: Creates a new Appointment
	 * @param event std. base event for UI5.
	 */
	public async onAppointmentCreate(event: Event): Promise<void> {
		const parameters = event.getParameters() as {
			startDate: Date;
			endDate: Date;
			id: string;
		};

		const tempUiRecord =
			TimeRegistrationSetHandler.getInstance().createAppointMentUI(
				parameters.startDate,
				parameters.endDate
			);

		const appointmentControl = this.getCalndarAppointmentById(tempUiRecord.ID);
		if (appointmentControl) {
			void (await this.openAppointmentDialogByControl(appointmentControl));
		}
	}

	public async openAppointmentDialogByControl(
		openByControl: CalendarAppointment
	): Promise<void> {
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
			(this.popoverAppointment as ResponsivePopover).openBy(
				openByControl as unknown as Control
			);
		}
	}
}
