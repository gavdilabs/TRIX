import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $SinglePlanningCalendarSettings } from "sap/m/SinglePlanningCalendar";

declare module "./TRIXCalendar" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $TRIXCalendarSettings extends $SinglePlanningCalendarSettings {
        defaultView?: string | PropertyBindingInfo;
    }

    export default interface TRIXCalendar {

        // property: defaultView

        /**
         * Gets current value of property "defaultView".
         *
         * @returns Value of property "defaultView"
         */
        getDefaultView(): string;

        /**
         * Sets a new value for property "defaultView".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * @param defaultView New value for property "defaultView"
         * @returns Reference to "this" in order to allow method chaining
         */
        setDefaultView(defaultView: string): this;
    }
}
