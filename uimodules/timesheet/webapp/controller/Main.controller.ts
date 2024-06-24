/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import ResponsivePopover from "sap/m/ResponsivePopover";
import Event from "sap/ui/base/Event";
import TRIXCalendar from "../controls/TRIXCalendar";
import ApplicationModelHandler, {
	CalendarView,
} from "../dataHandlers/ApplicationModelHandler";
import DropDownHandler from "../dataHandlers/DropDownHandler";
import TimeRegistrationSetHandler from "../dataHandlers/TimeRegistrationSetHandler";
import TRIXCalendarEventHandler from "../eventHandlers/TRIXCalendarEventHandler";
import { trix } from "../model/entities-core";
import DateHelper from "../utils/DateHelper";
import BaseController from "./BaseController";
import Dialog from "sap/m/Dialog";
import MessageToast from "sap/m/MessageToast";
import Switch from "sap/m/Switch";
import Item from "sap/ui/core/Item";
import Formatter from "../model/formatter";
import Fragment from "sap/ui/core/Fragment";
import Context from "sap/ui/model/odata/v4/Context";
import Table from "sap/m/Table";
import Button from "sap/m/Button";
import MultiComboBox from "sap/m/MultiComboBox";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import List from "sap/m/List";
import Input from "sap/m/Input";
import MessageBox from "sap/m/MessageBox";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Select from "sap/m/Select";
import GridListItem from "sap/f/GridListItem";
import TimePicker from "sap/m/TimePicker";
import VBox from "sap/m/VBox";

/**
 * @namespace trix.timesheet.controller
 */
export default class Main extends BaseController {
	private dialogEditUser: Dialog;
	private oFilterPopover: ResponsivePopover;
	private oCatalogyPopover: ResponsivePopover;
	private tempUiRecord: Partial<trix.core.ITimeRegistration> = undefined;
	private cellPressed: boolean = false;
	private selectedSideItem: Item;
	private formatter = new Formatter("Formatter");
	private ddHandler: DropDownHandler = undefined;
	private oResourceBundle: ResourceBundle;

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

	/**
	 * Routing target - only firing if url has /Main
	 */
	private async onPatternMatched() {

		this.oResourceBundle = this.getResourceBundle();

		//ApplicationModelHandler init
		ApplicationModelHandler.getInstance().initialize(
			this,
			this.getResourceBundle()
		);

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
			this.getOdataModelCore(),
			this.getResourceBundle()
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

	/**
	 * Function for gettting a ref to the Calendar Control
	 * @returns an instance of a TRIXCalendar UI Control
	 */
	private getCalendarControl(): TRIXCalendar {
		return this.byId(this.createId("trixCalendar")) as TRIXCalendar;
	}

	/**
	 * Formatter: Sets configured color on the appointments
	 * @param appointmentType Appointment typ ie. Service, Absence, Attendance etc.
	 * @param appointmentSubtypeId Id of the subtype
	 * @returns color #hex
	 */
	public formatterAppointmentColor(
		appointmentType: trix.core.AllocationType,
		appointmentSubtypeId: string
	) {
		switch (appointmentType) {
			case trix.core.AllocationType.AbsenceAttendance:
				return ApplicationModelHandler.getInstance().getColorByAllocationType(
					appointmentType,
					this.ddHandler?.isSubtypeAttendance(
						appointmentType,
						appointmentSubtypeId
					)
				);
			default:
				return ApplicationModelHandler.getInstance().getColorByAllocationType(
					appointmentType
				);
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
				? DateHelper.addDaysToDate(params.date, 0)
				: (calendar.getStartDate() as Date),
			viewKey as CalendarView
		);
	}


	////// Edit User Dialog //////

	async onEditUser(oEvent: Event) {
		const params = oEvent.getParameters() as {listItem:GridListItem};
		if (!this.dialogEditUser) {
			this.dialogEditUser = (await Fragment.load({
				id: this.getView().getId(),
				name: "trix.timesheet.view.fragments.EditUserDialog",
				controller: this,
			})) as Dialog;
		}
		
		if (!this.dialogEditUser.isOpen()) {
			this.getView().addDependent(this.dialogEditUser);
			this.dialogEditUser.setBindingContext(params.listItem.getBindingContext());
			this.dialogEditUser.open();
			
			// const oFilter = new Filter("/WorkScheduleSet/user/userID", FilterOperator.EQ, 
			// 	params.listItem.getBindingContext().getProperty("userID"));
			// const oListBinding = (this.byId("WorkScheduleList") as List).getBinding("items") as ODataListBinding;
			// oListBinding.filter(oFilter);
			// oListBinding.isSuspended() ? oListBinding.resume() : oListBinding.refresh();
		}
	}

	onCloseEditUser(oEvent: Event) {
		(oEvent.getSource().getEventingParent() as Dialog).close();
	}

	onChangeAvatar() {
		return;
	}

	// Expected Work Hours //
	onQuickSetTimes(oEvent: Event) {
		const oPicker = oEvent.getSource() as TimePicker;
		const oItem = oEvent.getSource().getEventingParent().getEventingParent() as Item;
		const aPickContainers = oItem.findElements(false) as Array<VBox>;
		let aTimePickers: TimePicker[] = [];

		for (const container of aPickContainers) {
			const aItems = container.getItems();
			aTimePickers.push(aItems.find((el) => el.getId().includes("picker") && 
				el.getId() !== oPicker.getId()) as TimePicker);
		}
		for (const picker of aTimePickers) {
			if (picker == undefined) {
				continue;
			}
			picker.setValue(oPicker.getValue());
		}
	}



	


	////// Approval Page //////

	async updateRegistrationStatus(oEvent: Event) {
		const oBtn = oEvent.getSource() as Button;
		const sBtnType = oBtn.getType();
		const iCode = sBtnType === "Success" ? 3 : 4;
		const oRegistration = oBtn.getEventingParent() as Item;
		const oTable = oRegistration.getEventingParent() as Table;

		if (oTable.getSelectedItems().length > 0) {
			const aItems = oTable.getSelectedItems();
			for (const item of aItems) {
				const oBindingContext = item.getBindingContext() as Context;
				await oBindingContext.setProperty("registrationStatus", iCode);
			}
			oTable.getBinding("items").refresh();
		}
		else {
			const oBindingContext = oRegistration.getBindingContext() as Context;
			await oBindingContext.setProperty("registrationStatus", iCode).then(() => {
				(oRegistration.getEventingParent() as Table).getBinding("items").refresh();
			});
		}
	}

	async onOpenFilterPopover(oEvent: Event) {
		const oButton = oEvent.getSource() as Button,
			oView = this.getView();

		if (!this.oFilterPopover) {
			this.oFilterPopover = (await Fragment.load({
				id: oView.getId(),
				name: "trix.timesheet.view.popovers.FilterPopover",
				controller: this,
			})) as ResponsivePopover;

			if (this.oFilterPopover) {
				oView.addDependent(this.oFilterPopover);
				const oFilterComboBox = this.byId("FilterComboBox") as MultiComboBox;
				oFilterComboBox.setSelectedKeys(['1'])
				
				this.oFilterPopover.openBy(oButton);
				return;
			}
		}
		if (this.oFilterPopover) {
			oView.addDependent(this.oFilterPopover);			
			this.oFilterPopover.openBy(oButton);
		}
	}

	onFilterRegistrations() {
		const oFilterComboBox = this.byId("FilterComboBox") as MultiComboBox,
			oTable = this.byId("ValidationTable") as Table,
			oBinding = oTable.getBinding("items") as ODataListBinding,
			aSelectedKeys = oFilterComboBox.getSelectedKeys();
		let aFilters: Filter[] = [];

		for (const key of aSelectedKeys) {
			aFilters.push(new Filter("registrationStatus", FilterOperator.EQ, key));
		}
		oBinding.filter(aFilters);
		oBinding.refresh();
	}

	onClearRegFilters() {
		const oFilterComboBox = this.byId("FilterComboBox") as MultiComboBox,
			oTable = this.byId("ValidationTable") as Table,
			oBinding = oTable.getBinding("items") as ODataListBinding;
		let aFilters: Filter[] = [];

		oFilterComboBox.setSelectedKeys([]);
		oBinding.filter(aFilters);
		oBinding.refresh();
	}


	////// Configuration Page //////

	async onOpenCatalogyPopover(oEvent: Event) {
		const oButton = oEvent.getSource() as Button,
			oView = this.getView();

		if (!this.oCatalogyPopover) {
			this.oCatalogyPopover = (await Fragment.load({
				id: oView.getId(),
				name: "trix.timesheet.view.popovers.CatalogyPopover",
				controller: this,
			})) as ResponsivePopover;

			if (this.oCatalogyPopover) {
				oView.addDependent(this.oCatalogyPopover);				
				this.oCatalogyPopover.openBy(oButton);
				return;
			}
		}
		if (this.oCatalogyPopover) {
			oView.addDependent(this.oCatalogyPopover);			
			this.oCatalogyPopover.openBy(oButton);
		}
	}

	onAddNewCatalogy() {
		const oCatalogyList = this.byId("CatalogyList") as List;
		const oRegTypeTable = this.byId("RegistrationTypesTable") as Table;
		const oInput = this.byId("CatalogyInput") as Input;
		const oBinding = oCatalogyList.getBinding("items") as ODataListBinding;

		if (oInput.getValue().length < 1) {
			MessageBox.warning(this.oResourceBundle.getText("msg_newCatalogyEmpty"), {
				actions: [(MessageBox as any).Action.CLOSE],
				emphasizedAction: (MessageBox as any).Action.CLOSE
			});
			return;
		}

		const oInitData = {
			name: oInput.getValue()
		}
		oBinding.create(oInitData).created().then(async () => {
			oBinding.refresh();
			oRegTypeTable.getItems().forEach((oItem) => {
				const oSelect = oItem.findElements(true).find((element) => element.getDomRef()?.className.includes("sapMSlt")) as Select;
				oSelect.getBinding("items").refresh();
			})
		});
	}

	onRemoveCatalogy(oEvent: Event) {
		const oContext = (oEvent.getSource() as Button).getBindingContext("admin") as Context;
		const oRegTypeTable = this.byId("RegistrationTypesTable") as List;

		MessageBox.warning(this.oResourceBundle.getText("msg_deleteCatalogyWarning"), {
			actions: [(MessageBox as any).Action.YES, (MessageBox as any).Action.CANCEL],
			emphasizedAction: (MessageBox as any).Action.YES,
			onClose: (sAction: any) => {
				if (sAction === (MessageBox as any).Action.YES) {
					oContext.delete().then(() => {
						oRegTypeTable.getItems().forEach((oItem) => {
							const oSelect = oItem.findElements(true).find((element) => element.getDomRef()?.className.includes("sapMSlt")) as Select;
							oSelect.getBinding("items").refresh();
						})
						MessageToast.show(this.oResourceBundle.getText("msg_catalogyDeleted"), {
							closeOnBrowserNavigation: false
						});
					});
				}
			}
		});
	}

	onAddNewRegType() {
		const oRegTypeTable = this.byId("RegistrationTypesTable") as Table;
		const oBinding = oRegTypeTable.getBinding("items") as ODataListBinding;

		oBinding.create().created().then(async () => {
			oBinding.refresh();
		});
	}

	async onRemoveRegType(oEvent: Event) {
		const oContext = (oEvent.getSource() as Button).getBindingContext("admin") as Context;

		MessageBox.warning(this.oResourceBundle.getText("msg_deleteRegTypeWarning"), {
			actions: [(MessageBox as any).Action.YES, (MessageBox as any).Action.CANCEL],
			emphasizedAction: (MessageBox as any).Action.YES,
			onClose: (sAction: any) => {
				if (sAction === (MessageBox as any).Action.YES) {
					oContext.delete().then(() => {
						MessageToast.show(this.oResourceBundle.getText("msg_regTypeDeleted"), {
							closeOnBrowserNavigation: false
						});
					});
				}
			}
		});
	}
}
