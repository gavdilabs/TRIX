import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./UserAvatar" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $UserAvatarSettings extends $ControlSettings {
        firstName?: string | PropertyBindingInfo;
        lastName?: string | PropertyBindingInfo;
        userId?: string | PropertyBindingInfo;
        press?: (event: UserAvatar$PressEvent) => void;
    }

    export default interface UserAvatar {

        // property: firstName
        getFirstName(): string;
        setFirstName(firstName: string): this;

        // property: lastName
        getLastName(): string;
        setLastName(lastName: string): this;

        // property: userId
        getUserId(): string;
        setUserId(userId: string): this;

        // event: press
        attachPress(fn: (event: UserAvatar$PressEvent) => void, listener?: object): this;
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: UserAvatar$PressEvent, data: CustomDataType) => void, listener?: object): this;
        detachPress(fn: (event: UserAvatar$PressEvent) => void, listener?: object): this;
        firePress(parameters?: UserAvatar$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of UserAvatar's 'press' event.
     */
    // eslint-disable-next-line
    export interface UserAvatar$PressEventParameters {
    }

    /**
     * Type describing the UserAvatar's 'press' event.
     */
    export type UserAvatar$PressEvent = Event<UserAvatar$PressEventParameters>;
}
