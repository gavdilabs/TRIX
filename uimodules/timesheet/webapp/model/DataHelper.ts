import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

export default abstract class DataHelper {
	private viewController: Controller = undefined;
	private odataModel: ODataModel = undefined;

	constructor(viewController: Controller, odataModel: ODataModel) {
		this.viewController = viewController;
		this.odataModel = odataModel;
	}

	public getOdataModel(): ODataModel | undefined{
		return this.odataModel;
	}

	public getViewController(): Controller | undefined {
		return this.viewController;
	}

	public getView(): View | undefined{
		return this.viewController?.getView();
	}
}
