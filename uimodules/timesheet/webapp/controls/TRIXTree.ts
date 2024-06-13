import Tree from "sap/m/Tree";
import RenderManager from "sap/ui/core/RenderManager";
/**
 * @namespace trix.timesheet.controls
 */
export default class TRIXTree extends Tree {
	static readonly metadata = {
		properties: {},
	};

	onAfterRendering(oEvent: jQuery.Event): void {
		super.onAfterRendering(oEvent);
		this.removeSelections(true); //When being reopened in popover same type cannot be selected w/o this
	}

	static renderer = RenderManager.getRenderer(Tree.prototype);
}
