import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import ResponsivePopover from "sap/m/ResponsivePopover";
import Fragment from "sap/ui/core/Fragment";
import Button from "sap/m/Button";

/**
 * @namespace trix.timesheet.controller
 */
export default class Main extends BaseController {
	private timeRegPopover: ResponsivePopover;


	async onNewTimeReg(oEvent: Event) {
		const oView = this.getView();
		if (!this.timeRegPopover) {
			this.timeRegPopover = (await Fragment.load({
				id: oView.getId(),
				name: "trix.timesheet.view.fragments.TimeRegPopover",
				controller: this,
			})) as ResponsivePopover;
			oView.addDependent(this.timeRegPopover);
		}
		this.timeRegPopover.openBy(oView.byId("page"))
	}
}
