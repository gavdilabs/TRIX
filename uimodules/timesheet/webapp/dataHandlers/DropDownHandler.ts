import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { trix } from "../model/entities-core";
import ModelDataHelper from "../utils/ModelDataHelper";

export interface IAllocationTreeItem {
	text: string;
	key: string;
	isSelectable: boolean;
	nodes?: IAllocationTreeItem[];
}

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
	private async refreshListAllocationTypes(
		forceRefresh: boolean = false
	): Promise<{ key: string; value: string }[]> {
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

			return parsedTypes;
		}

		return [];
	}

	/**
	 * Function for getting all the allocation subtypes available from the system
	 * @param forceRefresh Will only fetch data 1 time ever - unless u set this to true
	 * @returns List/array of Allocation Subtypes
	 */
	private async refreshListAllocationSubTypes(
		forceRefresh: boolean = false
	): Promise<trix.core.ITimeAllocation[]> {
		if (
			this.controller.getView().getModel(this.MODELNAME_ALLOCATION_SUB_TYPES) &&
			forceRefresh === false
		) {
			return (
				this.controller
					.getView()
					.getModel(this.MODELNAME_ALLOCATION_SUB_TYPES) as JSONModel
			).getData() as trix.core.ITimeAllocation[];
		}

		const data = await ModelDataHelper.getModelData<
			trix.core.ITimeAllocation[]
		>(this.odataModel, "/TimeAllocationSet?$orderby=description", {});

		if (data && Array.isArray(data)) {
			this.controller
				.getView()
				.setModel(new JSONModel(data), this.MODELNAME_ALLOCATION_SUB_TYPES);

			return data;
		}

		return [];
	}

	/**
	 * Function that builds the allocation tree selection
	 * @param forceRefresh Will only fetch data 1 time ever - unless u set this to true
	 * @returns Array of IAllocationTreeItem
	 */
	public async loadAllocationTree(
		forceRefresh: boolean = false
	): Promise<IAllocationTreeItem[]> {
		const types = await this.refreshListAllocationTypes(forceRefresh);
		const subTypes = await this.refreshListAllocationSubTypes(forceRefresh);

		if (!types || !subTypes) {
			return [];
		}

		if (
			this.controller.getView().getModel(this.MODELNAME_ALLOCATION_TREE) &&
			forceRefresh === false
		) {
			return (
				this.controller
					.getView()
					.getModel(this.MODELNAME_ALLOCATION_TREE) as JSONModel
			).getData() as IAllocationTreeItem[];
		}

		//Simple 2 level tree for now - that may change ofc
		const nodesStructure: IAllocationTreeItem[] = [];
		types.forEach((type) => {
			const parentNode: IAllocationTreeItem = {
				isSelectable: false,
				key: type.key,
				text: type.value,
				nodes: [],
			};

			//Link all children to the parent node
			const subtypes4Parent = subTypes.filter(
				(item) =>
					item.allocationType === (parentNode.key as trix.core.AllocationType)
			);

			if (subtypes4Parent) {
				subtypes4Parent.forEach((subtype) => {
					parentNode.nodes.push({
						isSelectable: true,
						key: subtype.ID,
						text: subtype.description,
						nodes: [],
					});
				});
			}

			nodesStructure.push(parentNode);
		});

		if (nodesStructure.length > 0) {
			this.controller
				.getView()
				.setModel(
					new JSONModel(nodesStructure),
					this.MODELNAME_ALLOCATION_TREE
				);

			return nodesStructure;
		}

		return [];
	}
}
