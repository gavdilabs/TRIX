import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { trix } from "../model/entities-core";
import ModelDataHelper from "../utils/ModelDataHelper";
import ApplicationModelHandler from "./ApplicationModelHandler";

/**
 * Interface for the items in the Allocation Tree
 */
export interface IAllocationTreeItem {
	text: string;
	key: string;
	isSelectable: boolean;
	nodes?: IAllocationTreeItem[];
}

/**
 * Extension Interface to get access to the allocation navTo on TimeAllocation
 */
export interface IExtendedTimeAllocation extends trix.core.ITimeAllocation {
	allocationTypeExtended: trix.core.AllocationType | ExtendedAllocationTypes;
}

/**
 * Enum to help break up the Absence&Attendance type into 2 separate in the UI
 */
export enum ExtendedAllocationTypes {
	Absence = "Absence",
	Attendance = "Attendance",
}

/**
 * Interface describing an AllocationType when used in the UI
 */
export interface IAllocationType {
	key: string;
	value: string;
	color: string;
}

/**
 * Helper class for the different Dropdown lists - putting data into JSON models for 1 time binding etc having post manipulated the data
 */
export default class DropDownHandler {
	public static readonly MODELNAME_ALLOCATION_TYPES = "ListAllocationTypes";
	public static readonly MODELNAME_ALLOCATION_TYPES_LEGEND =
		"ListAllocationTypesLegend";
	public static readonly MODELNAME_ALLOCATION_SUB_TYPES =
		"ListAllocationSubTypes";
	public static readonly MODELNAME_ALLOCATION_TREE = "TreeAllocations";
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
			this.controller
				.getView()
				.getModel(DropDownHandler.MODELNAME_ALLOCATION_TYPES) &&
			forceRefresh === false
		) {
			return;
		}

		let data = await ModelDataHelper.getModelData<string[]>(
			this.odataModel,
			"/getAllocationTypes()",
			{}
		);

		//We Remove the combined absence and attendance and add 2 individual
		data = data.filter(
			(dataItem) =>
				dataItem !== (trix.core.AllocationType.AbsenceAttendance as string)
		);
		data.push(ExtendedAllocationTypes.Absence);
		data.push(ExtendedAllocationTypes.Attendance);

		const parsedTypes: IAllocationType[] = [];
		if (data && Array.isArray(data)) {
			data.forEach((itemName) =>
				parsedTypes.push({
					key: itemName,
					value: this.i18nBundle.getText(`AllocationType${itemName}`),
					color: ApplicationModelHandler.getInstance().getColorByAllocationType(
						itemName as trix.core.AllocationType,
						itemName === (ExtendedAllocationTypes.Attendance as string)
					),
				})
			);
			this.controller
				.getView()
				.setModel(
					new JSONModel(parsedTypes),
					DropDownHandler.MODELNAME_ALLOCATION_TYPES
				);

			return parsedTypes;
		}

		return [];
	}

	/**
	 * Return boolean indicator if an allocationType and acc. subtype is Attendance type
	 * @param allocationType Project/Service etc
	 * @param subtypeId allocation subtype from the AllocationType
	 * @returns boolean true | false
	 */
	public isSubtypeAttendance(
		allocationType: trix.core.AllocationType,
		subtypeId: string
	): boolean {
		const allSubtypes = (
			this.controller.getView().getModel("ListAllocationSubTypes") as JSONModel
		).getData() as trix.core.ITimeAllocation[];

		const subtype = allSubtypes?.find(
			(subtypeTmp) =>
				subtypeTmp.ID === subtypeId &&
				subtypeTmp.allocationType === allocationType
		);
		return subtype && subtype.isAbsence ? false : true;
	}

	/**
	 * Function for getting all the allocation subtypes available from the system
	 * @param forceRefresh Will only fetch data 1 time ever - unless u set this to true
	 * @returns List/array of Allocation Subtypes
	 */
	private async refreshListAllocationSubTypes(
		forceRefresh: boolean = false
	): Promise<IExtendedTimeAllocation[]> {
		if (
			this.controller
				.getView()
				.getModel(DropDownHandler.MODELNAME_ALLOCATION_SUB_TYPES) &&
			forceRefresh === false
		) {
			return (
				this.controller
					.getView()
					.getModel(DropDownHandler.MODELNAME_ALLOCATION_SUB_TYPES) as JSONModel
			).getData() as IExtendedTimeAllocation[];
		}

		const data = await ModelDataHelper.getModelData<IExtendedTimeAllocation[]>(
			this.odataModel,
			"/TimeAllocationSet?$orderby=description",
			{}
		);

		//Make some overrides on Attendance and Absence
		data.forEach((dataItem) => {
			if (
				dataItem.allocationType === trix.core.AllocationType.AbsenceAttendance
			) {
				dataItem.allocationTypeExtended = dataItem.isAbsence
					? ExtendedAllocationTypes.Absence
					: ExtendedAllocationTypes.Attendance;
			} else {
				dataItem.allocationTypeExtended = dataItem.allocationType;
			}
		});

		if (data && Array.isArray(data)) {
			this.controller
				.getView()
				.setModel(
					new JSONModel(data),
					DropDownHandler.MODELNAME_ALLOCATION_SUB_TYPES
				);

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
			this.controller
				.getView()
				.getModel(DropDownHandler.MODELNAME_ALLOCATION_TREE) &&
			forceRefresh === false
		) {
			return (
				this.controller
					.getView()
					.getModel(DropDownHandler.MODELNAME_ALLOCATION_TREE) as JSONModel
			).getData() as IAllocationTreeItem[];
		}
		const addSubtypesToParent = (
			parentNode: IAllocationTreeItem,
			subtypes4Parent: trix.core.ITimeAllocation[]
		) => {
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
		};

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
					item.allocationTypeExtended === (parentNode.key as trix.core.AllocationType)
			);
			addSubtypesToParent(parentNode, subtypes4Parent);
			nodesStructure.push(parentNode);
		});

		if (nodesStructure.length > 0) {
			this.controller
				.getView()
				.setModel(
					new JSONModel(nodesStructure),
					DropDownHandler.MODELNAME_ALLOCATION_TREE
				);

			return nodesStructure;
		}

		return [];
	}
}
