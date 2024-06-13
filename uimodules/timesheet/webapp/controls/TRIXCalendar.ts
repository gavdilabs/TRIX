import SinglePlanningCalendar from "sap/m/SinglePlanningCalendar";
import RenderManager from "sap/ui/core/RenderManager";
/**
 * @namespace trix.timesheet.controls
 */
export default class TRIXCalendar extends SinglePlanningCalendar {
	private defaultViewSet: boolean = false;

	static readonly metadata = {
		properties: {
			defaultView: {
				type: "string",
			},
		},
	};

	onAfterRendering(oEvent: jQuery.Event): void {
		super.onAfterRendering(oEvent);

		//Handle default view setting (custom)
		if (this.getDefaultView() && !this.defaultViewSet) {
			this.setSelectedView(this.getViewByKey(this.getDefaultView()));
			this.defaultViewSet = true;
		}
	}

	static renderer = RenderManager.getRenderer(SinglePlanningCalendar.prototype);
}
