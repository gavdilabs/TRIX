import Event from "sap/ui/base/Event";

export enum AppointmentPopoverMode {
	DRAGGED = "DRAGGED",
	SELECTED = "SELECTED",
	CELLPRESS = "CELLPRESS",
}

export interface ICalendarEventHandler {
	onAppointmentDrop?: (event: Event) => Promise<void>;
	onCellPress?: (event: Event, mode: AppointmentPopoverMode) => Promise<void>;
	onAppointmentCreate?: (
		event: Event,
		mode: AppointmentPopoverMode
	) => Promise<void>;
	onAppointmentSelect?: (event: Event) => Promise<void>;
}
