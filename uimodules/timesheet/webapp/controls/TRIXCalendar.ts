import SinglePlanningCalendar from "sap/m/SinglePlanningCalendar";
import Event from "sap/ui/base/Event";
import RenderManager from "sap/ui/core/RenderManager";
import { AppointmentPopoverMode, ICalendarEventHandler } from "../eventHandlers/EventTypes";
/**
 * @namespace trix.timesheet.controls
 */

export default class TRIXCalendar extends SinglePlanningCalendar {
	private initialized: boolean = false;
	private eventHandler: ICalendarEventHandler = undefined;

	static readonly metadata = {
		properties: {
			defaultView: {
				type: "string",
			},
		},
	};

	/**
	 * Possible to set an external eventhandler class so as to not flood controllers with event impl functions
	 * @param eventHandler ICalendarEventHandler implementation
	 */
	public setEventHandler(eventHandler: ICalendarEventHandler): void {
		this.eventHandler = eventHandler;

		//Add individual eventhandlers
		//AppointmentDrop?
		if (this.eventHandler.onAppointmentDrop) {
			this.attachAppointmentDrop((event: Event) => {
				void this.eventHandler.onAppointmentDrop(event);
			});
		}
		//AppointmentCreate?
		if (this.eventHandler.onAppointmentCreate) {
			//@ts-expect-error: UI5 does not support multiple params on events, but the UI xml does
			this.attachAppointmentCreate((event:Event, mode:AppointmentPopoverMode) => {
				void this.eventHandler.onAppointmentCreate(event,mode);
			});
		}
		//Calendar Cell Press
		if(this.eventHandler.onCellPress){
			//@ts-expect-error: UI5 does not support multiple params on events, but the UI xml does
			this.attachCellPress((event:Event, mode:AppointmentPopoverMode) => {
				void this.eventHandler.onCellPress(event,mode);
			});
		}
		//OnAppoinrment
		if(this.eventHandler.onAppointmentSelect){
			this.attachAppointmentSelect((event:Event) => {
				void this.eventHandler.onAppointmentSelect(event);
			});
		}
	}

	/**
	 * Default hook onEfterRendering to take care of default view fx
	 * @param oEvent 
	 */
	onAfterRendering(oEvent: jQuery.Event): void {
		super.onAfterRendering(oEvent);

		//Handle default view setting (custom)
		if (!this.initialized) {
			if (this.getDefaultView()) {
				this.setSelectedView(this.getViewByKey(this.getDefaultView()));
			}

			this.initialized = true;
		}
	}

	static renderer = RenderManager.getRenderer(SinglePlanningCalendar.prototype);
}