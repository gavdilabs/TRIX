import Event from "sap/ui/base/Event";

/**
 * To distinguish btw. in what mode/context an Appointment is created we introduce a second param in the event. This event should be added in the XML mapping. ie. like cellPress="onCellPress($event, 'CELLPRESS')"
 */
export enum AppointmentPopoverMode {
	DRAGGED = "DRAGGED",
	SELECTED = "SELECTED",
	CELLPRESS = "CELLPRESS",
	RESIZE = "RESIZE",
}

/**
 * Common interface to support a CalendarEventHandler for the TRIXCalendar control.
 */
export interface ICalendarEventHandler {
	onAppointmentDrop?: (event: Event) => Promise<void>;
	onCellPress?: (event: Event, mode: AppointmentPopoverMode) => Promise<void>;
	onAppointmentCreate?: (
		event: Event,
		mode: AppointmentPopoverMode
	) => Promise<void>;
	onAppointmentSelect?: (
		event: Event,
		mode: AppointmentPopoverMode
	) => Promise<void>;
	onAppointmentResize?: (
		event: Event,
		mode: AppointmentPopoverMode
	) => Promise<void>;
}
