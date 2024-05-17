import CalendarWeekNumbering from "sap/ui/core/date/CalendarWeekNumbering";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $SinglePlanningCalendarSettings } from "sap/m/SinglePlanningCalendar";

declare module "./TRIXCalendar" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $TRIXCalendarSettings extends $SinglePlanningCalendarSettings {
        calendarWeekNumbering?: CalendarWeekNumbering | PropertyBindingInfo | `{${string}}`;
        enableAppointmentsCreate?: boolean | PropertyBindingInfo | `{${string}}`;
        enableAppointmentsDragAndDrop?: boolean | PropertyBindingInfo | `{${string}}`;
        enableAppointmentsResize?: boolean | PropertyBindingInfo | `{${string}}`;
    }

    export default interface TRIXCalendar {

        // property: calendarWeekNumbering

        /**
         * Gets current value of property "calendarWeekNumbering".
         *
         * Default value is: "CalendarWeekNumbering.Default,"
         * @returns Value of property "calendarWeekNumbering"
         */
        getCalendarWeekNumbering(): CalendarWeekNumbering;

        /**
         * Sets a new value for property "calendarWeekNumbering".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: "CalendarWeekNumbering.Default,"
         * @param [calendarWeekNumbering="CalendarWeekNumbering.Default,"] New value for property "calendarWeekNumbering"
         * @returns Reference to "this" in order to allow method chaining
         */
        setCalendarWeekNumbering(calendarWeekNumbering: CalendarWeekNumbering): this;

        // property: enableAppointmentsCreate

        /**
         * Gets current value of property "enableAppointmentsCreate".
         *
         * Default value is: true
         * @returns Value of property "enableAppointmentsCreate"
         */
        getEnableAppointmentsCreate(): boolean;

        /**
         * Sets a new value for property "enableAppointmentsCreate".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: true
         * @param [enableAppointmentsCreate=true] New value for property "enableAppointmentsCreate"
         * @returns Reference to "this" in order to allow method chaining
         */
        setEnableAppointmentsCreate(enableAppointmentsCreate: boolean): this;

        // property: enableAppointmentsDragAndDrop

        /**
         * Gets current value of property "enableAppointmentsDragAndDrop".
         *
         * Default value is: true
         * @returns Value of property "enableAppointmentsDragAndDrop"
         */
        getEnableAppointmentsDragAndDrop(): boolean;

        /**
         * Sets a new value for property "enableAppointmentsDragAndDrop".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: true
         * @param [enableAppointmentsDragAndDrop=true] New value for property "enableAppointmentsDragAndDrop"
         * @returns Reference to "this" in order to allow method chaining
         */
        setEnableAppointmentsDragAndDrop(enableAppointmentsDragAndDrop: boolean): this;

        // property: enableAppointmentsResize

        /**
         * Gets current value of property "enableAppointmentsResize".
         *
         * Default value is: true
         * @returns Value of property "enableAppointmentsResize"
         */
        getEnableAppointmentsResize(): boolean;

        /**
         * Sets a new value for property "enableAppointmentsResize".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: true
         * @param [enableAppointmentsResize=true] New value for property "enableAppointmentsResize"
         * @returns Reference to "this" in order to allow method chaining
         */
        setEnableAppointmentsResize(enableAppointmentsResize: boolean): this;
    }
}
