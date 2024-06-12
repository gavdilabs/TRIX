import Context from "sap/ui/model/odata/v4/Context";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

export class OdataListbindingWrapper<T> {
  private listBinding: ODataListBinding = undefined;
  private contextsMap: Map<string, Context> = undefined;
  private entityKeys: string[] = undefined;
  private model: ODataModel = undefined;

  constructor(listBinding: ODataListBinding, entityKeys: string[]) {
    if( !listBinding ){
      throw new Error("No Listbinding Supplied");
    }
    this.listBinding = listBinding;
    this.model = listBinding?.getModel() as ODataModel;
    this.entityKeys = entityKeys;
    this.contextsMap = new Map<string, Context>();

    this.listBinding.refresh();
    this.listBinding.attachDataReceived(this.onDataReceived.bind(this));
  }

  private onDataReceived(): void {
    const allContexts = this.listBinding.getContexts();
    allContexts.forEach((context) => {
      this.updateContextInMap(context);
    });
  }

  private updateContextInMap(context: Context): void {
    const mapKey = this.createMapKeyFromData(context.getObject() as T);
    this.contextsMap.set(mapKey, context);
  }

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

  public async createItem(newItem: Partial<T>): Promise<Context | undefined> {
    try {
      const newContext = this.listBinding.create(newItem);
      void (await newContext.created());
      this.updateContextInMap(newContext);

      this.listBinding.refresh();
      return newContext;
    } catch (error) {
      return undefined;
    }
  }

  private getContext(itemData: Partial<T>): Context {
    const mapKey = this.createMapKeyFromData(itemData);
    return this.contextsMap.has(mapKey)
      ? this.contextsMap.get(mapKey)
      : undefined;
  }

  public async patchItem(
    updatedItem: Partial<T>,
    omit: string[] = []
  ): Promise<void> {
    const mapKey = this.createMapKeyFromData(updatedItem);
    const mapContext = this.getContext(updatedItem);

    const removeAttrFromObject = <O extends object, A extends keyof O>(
      object: O,
      attr: A
    ): Omit<O, A> => {
      const newObject = { ...object }
    
      if (attr in newObject) {
        delete newObject[attr]
      }
    
      return newObject
    }

    //remove unwanted fields
    omit.forEach((omitFieldName) => removeAttrFromObject(updatedItem,omitFieldName as keyof T));

    if (mapContext) {
      for (const [key, newValue] of Object.entries(updatedItem)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const existingValue = mapContext.getProperty(
          `${mapContext.getPath()}/${key}`
        );

        if (existingValue !== newValue) {
          void await mapContext.setProperty(
            `${mapContext.getPath()}/${key}`,
            newValue,
            mapKey
          );
        }
      }
    }

    if (this.model.hasPendingChanges(mapKey)) {
      await this.model.submitBatch(mapKey);
    }
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
