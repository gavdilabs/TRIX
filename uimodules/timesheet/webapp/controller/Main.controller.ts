import Event from "sap/ui/base/Event";
import Fragment from "sap/ui/core/Fragment";
import TRIXCalendar from "../controls/TRIXCalendar";
import ApplicationModelHandler, {
	CalendarView,
} from "../dataHandlers/ApplicationModelHandler";
import DropDownHandler from "../dataHandlers/DropDownHandler";
import TimeRegistrationSetHandler from "../dataHandlers/TimeRegistrationSetHandler";
import TRIXCalendarEventHandler from "../eventHandlers/TRIXCalendarEventHandler";
import DateHelper from "../utils/DateHelper";
import BaseController from "./BaseController";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import HBox from "sap/m/HBox";
import Dialog from "sap/m/Dialog";
import { trix } from "../model/entities-core";
import Context from "sap/ui/model/odata/v4/Context";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import List from "sap/m/List";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

/**
 * @namespace trix.timesheet.controller
 */
export default class Main extends BaseController {
    private ddHandler: DropDownHandler = undefined;
	private editingUserID: string;
	private _userDialog: Dialog;

	/**
	 * UI5 Hook Function - Called once on initialization
	 */
	public onInit(): void {
		this.getRouter()
			.getRoute("main")
			.attachPatternMatched(() => {
				void this.onPatternMatched();
			}, this);
	}

	public async getActiveUser(): Promise<trix.core.IUser> {
		const oBinding = this.getView().getModel().bindContext("/getActiveUser(...)") as ODataContextBinding;
		await oBinding.execute();
		return await oBinding.requestObject() as trix.core.IUser;	
	}

	private async setUser() {
		const activeUser = await this.getActiveUser();
		const header = this.getView().byId("trixHeader") as HBox;
		header.bindElement({ 
			path: `/UserSet('${activeUser.userID}')`,
			parameters: {
				$$updateGroupId: "userGroup"
			}
		});
	}

	/**
	 * Routing target - only firing if url has /Main
	 */
	private async onPatternMatched() {
		//ApplicationModelHandler init
		ApplicationModelHandler.getInstance().initialize(
			this,
			this.getResourceBundle()
		);

		await this.setUser();

		//Initialize the Data handler(s)
		void (await TimeRegistrationSetHandler.initialize(
			this.getOdataModelCore(),
			this,
			this.getResourceBundle(),
			new Date(),
			ApplicationModelHandler.getInstance().getCurrentCalendarView() as CalendarView
		));

		//Preload some popup lists
		this.ddHandler = new DropDownHandler(
			this,
			this.getOdataModelCore()
		);

		//Preload the allocation tree data
		void (await this.ddHandler.loadAllocationTree());

		//Load last as other dependencies, formatter etc. need to use the ddhandler based on calendar data
		void (await TimeRegistrationSetHandler.getInstance().loadTimeRegistrations());

		//Set the Calendar EventHandler on the Trix Calendar
		this.getCalendarControl()?.setEventHandler(
			new TRIXCalendarEventHandler(this, this.getCalendarControl())
		);
	}

	public async userPressed(oEvent:Event) {
		this._userDialog ??= await Fragment.load({ name: "trix.library.fragments.UserDialog", controller: this }) as Dialog;
		this.getView().addDependent(this._userDialog);
        
		const oContext = (oEvent.getSource().getEventingParent() as HBox).getBindingContext() as Context;
		this.editingUserID = oContext.getProperty("userID") as string;
		this._userDialog.setBindingContext(oContext);		
		this._userDialog.open();
		
		const oFilter = new Filter("user_userID", FilterOperator.EQ,this.editingUserID);
		const oListBinding = (this.byId("WorkScheduleList") as List).getBinding("items") as ODataListBinding;
		oListBinding.filter(oFilter);
		oListBinding.isSuspended() ? oListBinding.resume() : oListBinding.refresh();		
	}

	public onSaveUser(oEvent:Event) {
		const oModel = this.getView().getModel() as ODataModel;
		this.getView().setBusy(true);
		try {
			void oModel.submitBatch("userGroup").then(() => {
				this.getView().setBusy(false);	
				this._userDialog.close();		  
			});
		} catch (oError) {
			this.getView().setBusy(false);
		}
	}	

	onCloseEditUser(oEvent: Event) {
		(oEvent.getSource().getEventingParent() as Dialog).close();
	}
	/**
	 * Function for gettting a ref to the Calendar Control
	 * @returns an instance of a TRIXCalendar UI Control
	 */
	private getCalendarControl(): TRIXCalendar {
		return this.byId(this.createId("trixCalendar")) as TRIXCalendar;
	}

	/**
	 * Formatter: Sets configured color on the appointments
	 * @param appointmentSubtypeId Id of the TimeAllocation
	 * @returns color #hex
	 */
	public formatterAppointmentColor(appointmentSubtypeId: string) {
		if (!appointmentSubtypeId) {
			return "#FFFFFF";
		} else {
			return this.ddHandler.getTimeAllocationColor(appointmentSubtypeId);
		}
	}
/**
	 * Formatter: Sets configured color on the appointments
	 * @param appointmentSubtypeId Id of the TimeAllocation
	 * @returns color #hex
	 */
	public formatterAppointmentIcon(appointmentSubtypeId: string) {
		if (!appointmentSubtypeId) {
			return null;
		} else {
			return this.ddHandler.getTimeAllocationIcon(appointmentSubtypeId);
		}
	}

	/**
	 * Event Function for the ToggleButton "FullDay | WS Day"
	 * @param event Std. UI5 event
	 */
	public onToggleFullDay(event: Event) {
		const params = event.getParameters() as { pressed: boolean };
		this.getCalendarControl().setFullDay(params.pressed);
	}

	/**
	 * Triggers when Date View is changed on the Calendar
	 * @param event std. UI5 event
	 */
	public onCalendarChange(event: Event): void {
		const params = event.getParameters() as { date?: Date };
		const calendar: TRIXCalendar = event.getSource();
		const viewKey: string = calendar
			.getViewByViewId(calendar.getSelectedView())
			?.getKey();
		ApplicationModelHandler.getInstance().setCurrentView(
			viewKey as CalendarView
		);

		void TimeRegistrationSetHandler.updateDatesAndMode(
			params.date
				? DateHelper.addDaysToDate(params.date, 1)
				: (calendar.getStartDate() as Date),
			viewKey as CalendarView
		);
	}
}
