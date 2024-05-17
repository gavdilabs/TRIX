import SinglePlanningCalendar from "sap/m/SinglePlanningCalendar";
import Event from "sap/ui/base/Event";
import TimeRegistrationSetHandler from "../dataHandlers/TimeRegistrationSetHandler";
import BaseController from "./BaseController";

/**
 * @namespace trix.timesheet.controller
 */
export default class Main extends BaseController {
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

	private getCalendarControl(): SinglePlanningCalendar {
		return this.byId(this.createId("trixCalendar")) as SinglePlanningCalendar;
	}

	public onAppointmentCreate(event: Event): void {
		TimeRegistrationSetHandler.getInstance().createAppointMent(
			event.getParameter("startDate") as Date,
			event.getParameter("endDate") as Date
		);
	}
}
