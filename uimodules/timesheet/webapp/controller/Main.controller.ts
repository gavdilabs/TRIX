import TimeRegistrationSetHandler from "../model/TimeRegistrationSetHandler";
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

		void (await TimeRegistrationSetHandler.getInstance().loadTimeRegistrations(
			new Date(),
			new Date(2024, 6, 20)
		));
	}
}
