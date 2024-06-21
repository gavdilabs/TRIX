/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import ResponsivePopover from "sap/m/ResponsivePopover";
import SinglePlanningCalendar from "sap/m/SinglePlanningCalendar";
import StandardTreeItem from "sap/m/StandardTreeItem";
import Event from "sap/ui/base/Event";
import TRIXCalendar from "../controls/TRIXCalendar";
import ApplicationModelHandler, {
	CalendarView,
} from "../dataHandlers/ApplicationModelHandler";
import DropDownHandler from "../dataHandlers/DropDownHandler";
import TimeRegistrationSetHandler from "../dataHandlers/TimeRegistrationSetHandler";
import TRIXCalendarEventHandler from "../eventHandlers/TRIXCalendarEventHandler";
import { trix } from "../model/entities-core";
import BaseController from "./BaseController";
import Dialog from "sap/m/Dialog";
import ColorPickerPopover from "sap/ui/unified/ColorPickerPopover";
import ColorPickerDisplayMode from "sap/ui/unified/ColorPickerDisplayMode";
import MessageToast from "sap/m/MessageToast";
import { ValueState } from "sap/ui/core/library";
import Switch from "sap/m/Switch";
import Item from "sap/ui/core/Item";
import Formatter from "../model/formatter";
import Fragment from "sap/ui/core/Fragment";
import JSONModel from "sap/ui/model/json/JSONModel";
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
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import CustomListItem from "sap/m/CustomListItem";
import HBox from "sap/m/HBox";
import Text from "sap/m/Text";
import Select from "sap/m/Select";

/**
 * @namespace trix.timesheet.controller
 */
export default class Main extends BaseController {
	private dialogEditUser: Dialog;
	private colorInputId: string;
	private oColorPickerSimplifiedPopover: ColorPickerPopover;
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
		//Initialize the Data handler(s)
		void (await TimeRegistrationSetHandler.initialize(
			this.getOdataModelCore(),
			this,
			this.getResourceBundle()
		));

		this.oResourceBundle = this.getResourceBundle();

		//ApplicationModelHandler init
		ApplicationModelHandler.getInstance().initialize(
			this,
			this.getResourceBundle()
		);
		ApplicationModelHandler.getInstance().setCurrentView(
			ApplicationModelHandler.getInstance().getCurrentCalendarViewKey() as CalendarView
		);

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

	public onViewChange(event: Event): void {
		const calendar: TRIXCalendar = event.getSource();
		const viewKey: string = calendar.getViewByViewId(calendar.getSelectedView())?.getKey();
		ApplicationModelHandler.getInstance().setCurrentView(viewKey as CalendarView);
	}

	async onEditUser() {
		if (!this.dialogEditUser) {
			this.dialogEditUser = (await Fragment.load({
				id: this.getView().getId(),
				name: "trix.timesheet.view.fragments.EditUserDialog",
				controller: this,
			})) as Dialog;

			if (this.dialogEditUser) {
				this.dialogEditUser.open();
			}
		}
		else if (!this.dialogEditUser.isOpen()) {
			this.dialogEditUser.open();
		}
	}

	onCloseEditUser(oEvent: Event) {
		(oEvent.getSource().getEventingParent() as Dialog).close();
	}

	onChangeAvatar() {
		return;
	}

	openSimplifiedModeSample(oEvent: Event) {
		this.colorInputId = (oEvent.getSource()).getId() as string;
		if (!this.oColorPickerSimplifiedPopover) {
			this.oColorPickerSimplifiedPopover = new ColorPickerPopover("oColorPickerSimpplifiedPopover", {
				colorString: "pink",
				displayMode: ColorPickerDisplayMode.Simplified,
				change: this.handleColorChange.bind(this)
			});
		}
		this.oColorPickerSimplifiedPopover.openBy(oEvent.getSource());
	}

	handleColorChange() {
		const oView = this.getView(),
			oInput = oView.byId(this.colorInputId);

		oInput.setValue(oEvent.getParameter("colorString"));
		oInput.setValueState(ValueState.None);
		this.colorInputId = "";
		MessageToast.show("Chosen color string: " + oEvent.getParameter("colorString"));
	}

	toggleRegistrationTeamView() {
		const oRegSwitch = this.byId("registrationSwitch") as Switch;
		const oTeamSwitch = this.byId("teamSwitch") as Switch;
		const state = oRegSwitch.getState();
		oRegSwitch.setState(!state);
		oTeamSwitch.setState(state);
	}

	onToggle(oEvent: Event) {
		const oItem = oEvent.getParameter("item") as Item,
			iItemIndex = oItem ? parseInt(oItem.getId().replace(/^\D+/g, '')) : -1,
			bExpanded = oEvent.getParameter("expanded") as boolean;
		const oAppModel = this.getModel('ApplicationModel') as JSONModel;

		if (iItemIndex < 3) {
			if (oItem !== this.selectedSideItem && bExpanded) {
				oEvent.preventDefault();
				const oRegSwitch = this.byId("registrationSwitch") as Switch;
				const oTeamSwitch = this.byId("teamSwitch") as Switch;
				this.selectedSideItem = oItem;
				switch (iItemIndex) {
					case 1:
						oAppModel.setProperty("/registrationView", true);
						oAppModel.setProperty("/teamView", false);
						break;
					case 2:
						oAppModel.setProperty("/registrationView", false);
						oAppModel.setProperty("/teamView", true);
						oAppModel.setProperty("/showSidePanel", false);
						break;
					default:
						break;
				}
			}
			else if (oItem === this.selectedSideItem && bExpanded) {
				oEvent.preventDefault();
				return;
			}
		}
	}

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
