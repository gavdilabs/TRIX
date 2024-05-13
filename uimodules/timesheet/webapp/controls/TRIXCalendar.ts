import SinglePlanningCalendar from "sap/m/SinglePlanningCalendar";
import RenderManager from "sap/ui/core/RenderManager";
/**
 * @namespace trix.timesheet.controls
 */
export default class TRIXCalendar extends SinglePlanningCalendar {
	static readonly metadata = {
		properties: {},
	};

	static renderer = RenderManager.getRenderer(SinglePlanningCalendar.prototype);
}
