import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import type { MetadataOptions } from "sap/ui/core/Element";
import Avatar from "sap/m/Avatar";
import VBox from "sap/m/VBox";
import Text from "sap/m/Text";
import HBox from "sap/m/HBox";
/** 
 * @extends Control
 * @public
 * @name trix.library.UserAvatar
 */
export default class UserAvatar extends Control {
	
	constructor(idOrSettings?: string | $UserAvatarSettings);
	constructor(id?: string, settings?: $UserAvatarSettings);
	constructor(id?: string, settings?: $UserAvatarSettings) { super(id, settings); }

	static readonly metadata: MetadataOptions = {
		library: "trix.library",
		properties: {			
			firstName: {
				type: "string",
				group: "Data",
				defaultValue: null
			},			
			lastName: {
				type: "string",
				group: "Data",
				defaultValue: null
			},
            userId: {
				type: "string",
				group: "Data",
				defaultValue: null
			}
		},
		events: {
			press: {}
		}
	}	

	renderer = {
		apiVersion: 2,
		render: (rm: RenderManager, control: UserAvatar ) => {
			rm.openStart("div", control.getId());
			rm.openEnd();
            const avatar = new Avatar().addStyleClass("sapUiTinyMarginEnd");	
			avatar.attachPress(() => {
				control.firePress();
			});
			const vbox = new VBox({ justifyContent: "Center"});
			const hhox = new HBox({ alignItems:"Center"}).addStyleClass("sapUiTinyMargin");
			vbox.addItem(new Text({ text: (control.getProperty("firstName") as string) + ' ' + (control.getProperty("lastName") as string) } ));
			vbox.addItem(new Text({ text: (control.getProperty("userId") as string ) } ));
			hhox.addItem(avatar);
			hhox.addItem(vbox);			
			rm.renderControl(hhox);
			rm.close("div");
		}
	}

}
