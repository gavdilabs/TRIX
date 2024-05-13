import { $PlanningCalendarSettings } from "sap/m/PlanningCalendar";

declare module "./TRIXCalendar" {
	/**
	 * Interface defining the settings object used in constructor calls
	 */
	interface $TRIXCalendarSettings extends $PlanningCalendarSettings {}

	export default interface TrixCalendar {}
}
