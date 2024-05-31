import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { trix } from "../model/entities-core";
import ModelDataHelper from "../utils/ModelDataHelper";

export default class DropDownHandler {
	public readonly MODELNAME_ALLOCATION_TYPES = "ListAllocationTypes";
	public readonly MODELNAME_ALLOCATION_SUB_TYPES = "ListAllocationSubTypes";
	public readonly MODELNAME_ALLOCATION_TREE = "TreeAllocations";
	private controller: Controller = undefined;
	private odataModel: ODataModel = undefined;
	private i18nBundle: ResourceBundle = undefined;

	constructor(
		controller: Controller,
		odataModel: ODataModel,
		i18nBundle: ResourceBundle
	) {
		this.controller = controller;
		this.odataModel = odataModel;
		this.i18nBundle = i18nBundle;
	}

	/**
	 * Function to refresh the allocation types into UI JSON Model
	 * @param forceRefresh Will only fetch data 1 time ever - unless u set this to true
	 * @returns nothing - data is stored in JSON
	 */
	public async refreshListAllocationTypes(
		forceRefresh: boolean = false
	): Promise<void> {
		if (
			this.controller.getView().getModel(this.MODELNAME_ALLOCATION_TYPES) &&
			forceRefresh === false
		) {
			return;
		}

		const data = await ModelDataHelper.getModelData<string[]>(
			this.odataModel,
			"/getAllocationTypes()",
			{}
		);

		const parsedTypes: { key: string; value: string }[] = [];
		if (data && Array.isArray(data)) {
			data.forEach((itemName) =>
				parsedTypes.push({
					key: itemName,
					value: this.i18nBundle.getText(`AllocationType${itemName}`),
				})
			);
			this.controller
				.getView()
				.setModel(new JSONModel(parsedTypes), this.MODELNAME_ALLOCATION_TYPES);
		}
	}

	public async refreshListAllocationSubTypes(
		forceRefresh: boolean = false
	): Promise<void> {
		if (
			this.controller.getView().getModel(this.MODELNAME_ALLOCATION_SUB_TYPES) &&
			forceRefresh === false
		) {
			return;
		}

		const data = await ModelDataHelper.getModelData<
			trix.core.ITimeAllocation[]
		>(this.odataModel, "/TimeAllocationSet", {});

		if (data && Array.isArray(data)) {
			this.controller
				.getView()
				.setModel(new JSONModel(data), this.MODELNAME_ALLOCATION_SUB_TYPES);
		}
	}

    public async loadAllocationTree():Promise<void> {

    }
}
