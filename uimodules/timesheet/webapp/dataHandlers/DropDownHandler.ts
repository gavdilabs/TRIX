import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { trix } from "../model/entities-core";
import ModelDataHelper from "../utils/ModelDataHelper";

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
	order: number;
	icon?: string;
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

	constructor(controller: Controller, odataModel: ODataModel) {
		this.controller = controller;
		this.odataModel = odataModel;
	}

	/**
	 * Function to refresh the allocation types into UI JSON Model
	 * @param forceRefresh Will only fetch data 1 time ever - unless u set this to true
	 * @returns nothing - data is stored in JSON
	 */
	private async refreshListAllocationTypes(
		forceRefresh: boolean = false
	): Promise<IAllocationType[]> {
		if (
			this.controller
				.getView()
				.getModel(DropDownHandler.MODELNAME_ALLOCATION_TYPES) &&
			forceRefresh === false
		) {
			return;
		}

		const groups = await ModelDataHelper.getModelData<
			trix.core.ITimeAllocationGroup[]
		>(this.odataModel, "/TimeAllocationGroupSet", {});

		const parsedTypes: IAllocationType[] = [];
		if (groups && Array.isArray(groups)) {
			groups.forEach((item) => {
				parsedTypes.push({
					key: item.ID,
					value: item.title,
					color: item.hex,
					order: item.order,
					icon: item.icon,
				});
			});
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
	public isTimeAllocationAttendance(allocationId: string): boolean {
		const timeAlloc = this.getTimeAllocationById(allocationId);
		return timeAlloc && timeAlloc.isAbsence ? false : true;
	}

	/**
	 * Function for getting a ITimeAllocation Object from cache
	 * @param subtypeId id for the allocation suubtype
	 * @returns ITimeAllocation object or undefined
	 */
	private getTimeAllocationById(
		allocationId: string
	): trix.core.ITimeAllocation {
		const allTimeAllocs = (
			this.controller
				.getView()
				.getModel(DropDownHandler.MODELNAME_ALLOCATION_SUB_TYPES) as JSONModel
		).getData() as trix.core.ITimeAllocation[];

		return allTimeAllocs?.find((allocTemp) => allocTemp.ID === allocationId);
	}

	/**
	 * Function for getting an object ref to a ITimeAllocationGroup object
	 * @param groupId string group id
	 * @returns ITimeAllocationGroup data
	 */
	private getTimeAllocationGroupById(
		groupId: string
	): IAllocationType | undefined {
		const allTimeAllocGroups = (
			this.controller
				.getView()
				.getModel(DropDownHandler.MODELNAME_ALLOCATION_TYPES) as JSONModel
		).getData() as IAllocationType[];

		return allTimeAllocGroups.find((groupTmp) => groupTmp.key === groupId);
	}

	/**
	 * Function for returning the color configured for the relevant allocation id - if any === white
	 * @param allocationId TimeAllocation ID string key
	 * @returns hex color (defaults white)
	 */
	public getTimeAllocationColor(allocationId: string): string {
		const timeAlloc = this.getTimeAllocationById(allocationId);
		if (timeAlloc) {
			const parentGroup = this.getTimeAllocationGroupById(
				timeAlloc.allocationGroupId
			);
			return timeAlloc.hex ? timeAlloc.hex : parentGroup?.color ? parentGroup.color : "#FFFFFF";
		} else {
			return "#FFFFFF";
		}
	}

	/**
	 * Function for returning the icon configured for the relevant allocation id - if any
	 * @param allocationId TimeAllocation ID string key
	 * @returns hex color (defaults white)
	 */
	public getTimeAllocationIcon(allocationId: string): string {
		const timeAlloc = this.getTimeAllocationById(allocationId);
		if (timeAlloc) {
			const parentGroup = this.getTimeAllocationGroupById(
				timeAlloc.allocationGroupId
			);
			return timeAlloc.icon ? timeAlloc.icon : parentGroup?.icon ? parentGroup.icon : null;
		} else {
			return null;
		}
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
			this.controller
				.getView()
				.getModel(DropDownHandler.MODELNAME_ALLOCATION_SUB_TYPES) &&
			forceRefresh === false
		) {
			return (
				this.controller
					.getView()
					.getModel(DropDownHandler.MODELNAME_ALLOCATION_SUB_TYPES) as JSONModel
			).getData() as trix.core.ITimeAllocation[];
		}

		const timeAllocations = await ModelDataHelper.getModelData<
			trix.core.ITimeAllocation[]
		>(this.odataModel, "/TimeAllocationSet?$orderby=description", {});

		if (timeAllocations && Array.isArray(timeAllocations)) {
			this.controller
				.getView()
				.setModel(
					new JSONModel(timeAllocations),
					DropDownHandler.MODELNAME_ALLOCATION_SUB_TYPES
				);

			return timeAllocations;
		} else {
			return [];
		}
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
				(item) => item.allocationGroupId === parentNode.key
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
