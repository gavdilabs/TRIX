import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $TreeSettings } from "sap/m/Tree";

declare module "./TRIXTree" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $TRIXTreeSettings extends $TreeSettings {
        defaultView?: string | PropertyBindingInfo;
    }

    export default interface TRIXTree {

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
