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
        getDefaultView(): string;
        setDefaultView(defaultView: string): this;
    }
}
