import GridListItem from "sap/f/GridListItem";
import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import List from "sap/m/List";
import MessageToast from "sap/m/MessageToast";
import MultiComboBox from "sap/m/MultiComboBox";
import ResponsivePopover from "sap/m/ResponsivePopover";
import Table from "sap/m/Table";
import Event from "sap/ui/base/Event";
import Fragment from "sap/ui/core/Fragment";
import Item from "sap/ui/core/Item";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Context from "sap/ui/model/odata/v4/Context";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Formatter from "../model/formatter";
import ModelDataHelper from "../utils/ModelDataHelper";
import BaseController from "./BaseController";
/**
 * @namespace trix.approval.controller
 */
export default class Main extends BaseController {
	public formatter = new Formatter("Formatter");
	private oFilterPopover: ResponsivePopover;
	private editingUserID: string;
	private dialogEditUser: Dialog;

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
		void (await ModelDataHelper.getModelData2JsonModel(
			this.getOdataModelCore(),
			"/getRecordStatuses()",
			this,
			"RecordStatusList",
			{}
		));
	}

	/**
	 * Event function for updating a selected record to approved
	 * @param oEvent std. UI5 event
	 */
	public async updateRegistrationStatus(oEvent: Event) {
		const oBtn: Button = oEvent.getSource();
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
		} else {
			const oBindingContext = oRegistration.getBindingContext() as Context;
			await oBindingContext
				.setProperty("registrationStatus", iCode)
				.then(() => {
					(oRegistration.getEventingParent() as Table)
						.getBinding("items")
						.refresh();
				});
		}

		MessageToast.show(this.getResourceBundle().getText(`reg_status_${iCode}`));
	}

	/**
	 * Event function for opening the filter dialog
	 * @param oEvent std. ui5 event
	 * @returns void
	 */
	public async onOpenFilterPopover(oEvent: Event) {
		const oButton: Button = oEvent.getSource();
		const oView = this.getView();

		if (!this.oFilterPopover) {
			this.oFilterPopover = (await Fragment.load({
				id: oView.getId(),
				name: "trix.approval.view.dialogs.FilterPopover",
				controller: this,
			})) as ResponsivePopover;

			if (this.oFilterPopover) {
				oView.addDependent(this.oFilterPopover);
				const oFilterComboBox = this.byId("FilterComboBox") as MultiComboBox;
				oFilterComboBox.setSelectedKeys(["1"]);

				this.oFilterPopover.openBy(oButton);
				return;
			}
		}
		if (this.oFilterPopover) {
			oView.addDependent(this.oFilterPopover);
			this.oFilterPopover.openBy(oButton);
		}
	}

	/**
	 * Event function for when filter button is hit
	 */
	public onFilterRegistrations() {
		const oFilterComboBox = this.byId("FilterComboBox") as MultiComboBox,
			oTable = this.byId("ValidationTable") as Table,
			oBinding = oTable.getBinding("items") as ODataListBinding,
			aSelectedKeys = oFilterComboBox.getSelectedKeys();
		const aFilters: Filter[] = [];

		for (const key of aSelectedKeys) {
			aFilters.push(new Filter("registrationStatus", FilterOperator.EQ, key));
			if (key === "0") {
				aFilters.push(new Filter("registrationStatus", FilterOperator.EQ, 4));
			}
		}
		oBinding.filter(aFilters);
		oBinding.refresh();
	}

	/**
	 * Event function for clearing registration table filters
	 */
	public onClearRegFilters() {
		const oFilterComboBox = this.byId("FilterComboBox") as MultiComboBox,
			oTable = this.byId("ValidationTable") as Table,
			oBinding = oTable.getBinding("items") as ODataListBinding;
		const aFilters: Filter[] = [];

		oFilterComboBox.setSelectedKeys([]);
		oBinding.filter(aFilters);
		oBinding.refresh();
	}

	/**
	 * Event function for when a user is edited - will open popup
	 * @param oEvent std. ui5 event
	 */
	public async onEditUser(oEvent: Event) {
		const params = oEvent.getParameters() as { listItem: GridListItem };
		this.editingUserID = (
			params.listItem.getBindingContext().getObject() as { userID: string }
		).userID;
		if (!this.dialogEditUser) {
			this.dialogEditUser = (await Fragment.load({
				id: this.getView().getId(),
				name: "trix.approval.view.dialogs.EditUserDialog",
				controller: this,
			})) as Dialog;
		}

		if (!this.dialogEditUser.isOpen()) {
			this.getView().addDependent(this.dialogEditUser);
			this.dialogEditUser.setBindingContext(
				params.listItem.getBindingContext()
			);
			this.dialogEditUser.open();

			const oFilter = new Filter(
				"user_userID",
				FilterOperator.EQ,
				this.editingUserID
			);
			const oListBinding = (this.byId("WorkScheduleList") as List).getBinding(
				"items"
			) as ODataListBinding;
			oListBinding.filter(oFilter);
			oListBinding.isSuspended()
				? oListBinding.resume()
				: oListBinding.refresh();
		}
	}

	/**
	 * Event function triggered when edit user popup is closed
	 * @param oEvent std ui5 event
	 */
	public onCloseEditUser(oEvent: Event) {
		(oEvent.getSource().getEventingParent() as Dialog).close();
	}
}
