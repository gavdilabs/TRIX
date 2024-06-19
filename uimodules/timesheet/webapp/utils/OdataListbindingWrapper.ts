import Context from "sap/ui/model/odata/v4/Context";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

export class OdataListbindingWrapper<T> {
	private listBinding: ODataListBinding = undefined;
	private contextsMap: Map<string, Context> = undefined;
	private entityKeys: string[] = undefined;
	private model: ODataModel = undefined;

	/**
	 * Wrapper around listbinding
	 * @param listBinding Input listbinding to work on
	 * @param entityKeys array of the key names for the base entitiy ie ["ID"]
	 */
	constructor(listBinding: ODataListBinding, entityKeys: string[]) {
		if (!listBinding) {
			throw new Error("No Listbinding Supplied");
		}
		this.listBinding = listBinding;
		this.model = listBinding?.getModel() as ODataModel;
		this.entityKeys = entityKeys;
		this.contextsMap = new Map<string, Context>();
	}

	/**
	 * Returns all the contexts in the listbinding at current time
	 * @returns Array of Contexts
	 */
	public async getContexts(): Promise<Context[]> {
		void (await this.listBinding.requestContexts());
		return this.listBinding.getContexts();
	}

	/**
	 * Request new data remotely on the listbinding
	 */
	public async refreshBinding(): Promise<void> {
		void (await this.listBinding.requestRefresh());
	}

	/**
	 * Function that derives a uinique key for the inner map based on itemData and keys from constructor
	 * @param itemData itemdata to create map key from
	 * @returns string key
	 */
	private createMapKeyFromData(itemData: Partial<T>): string {
		if (!itemData) {
			throw new Error("No data to generate map key from");
		}
		let mapKey = "";
		for (const [key, value] of Object.entries(itemData)) {
			this.entityKeys.forEach((entityKey) => {
				if (entityKey === key) {
					mapKey += value as string;
				}
			});
		}

		//PostProcess Key
		mapKey = mapKey.replaceAll("-", ""); //No -´es
		mapKey = mapKey.length > 50 ? mapKey.substring(0, 50) : mapKey;

		return mapKey;
	}

	/**
	 * Create a new item on the listbinding
	 * @param newItem body for the create
	 * @returns Context from the created item
	 */
	public async createItem(newItem: Partial<T>): Promise<Context | undefined> {
		try {
			const newContext = this.listBinding.create(newItem);
			void (await newContext.created());

			this.listBinding.refresh();
			return newContext;
		} catch (error) {
			return undefined;
		}
	}

	/**
	 * Get specific context object based on the data item
	 * @param itemData Data item to look for its context
	 * @returns Context or undefined
	 */
	private getContext(itemData: Partial<T>): Context {
		const mapKey = this.createMapKeyFromData(itemData);
		return this.contextsMap.has(mapKey)
			? this.contextsMap.get(mapKey)
			: undefined;
	}

	/**
	 * General purpose function for deleting an item from a list
	 * @param itemData data containing atleast key data
	 */
	public async deleteItem(
		itemData: Partial<T>,
		onlyInContext: boolean = false
	): Promise<void> {
		const mapContext = this.getContext(itemData);

		if (mapContext) {
			if (!onlyInContext) {
				await mapContext.delete("$auto");
			}

			this.contextsMap.delete(this.createMapKeyFromData(itemData));
		}
	}
}
