import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

export default class ModelDataHelper {
	/**
	 * Function for getting objects generically
	 * @param model Odata Model Instance
	 * @param sPath entity path & possible key
	 * @param parameters
	 * @returns
	 */
	public static async getModelData<T>(
		model: ODataModel,
		sPath: string,
		parameters: object
	): Promise<T> {
		const objectContext = model
			.bindContext(sPath, null, parameters)
			.getBoundContext();

		try {
			const result = (await objectContext.requestObject()) as { value: T } | T;
			return (result as { value: T }).value
				? (result as { value: T }).value
				: (result as T);
		} catch (error) {
			throw new Error(
				typeof error === "string"
					? error
					: `Objects Data Request Failed: ${JSON.stringify(error)}`
			);
		}
	}

	/**
	 * Function for getting objects generically
	 * @param model Odata Model Instance
	 * @param sPath entity path & possible key
	 * @param parameters
	 * @returns void
	 */
	public static async getModelData2JsonModel(
		model: ODataModel,
		sPath: string,
		controller: Controller,
		modelName: string,
		parameters?: object
	): Promise<void> {
		const data = await this.getModelData<object>(model, sPath, parameters); //Throws
		if (data && controller) {
			controller.getView().setModel(new JSONModel(data), modelName);
		}
	}

	/**
	 * Function that allows posting to an Action on the CAP layer
	 * @param model Odatamodel to use
	 * @param actionName Name of the action to hit
	 * @param parameters Parameters structure that will serve as body
	 * @returns Result as <K>
	 */
	public static async postToAction<K>(
		model: ODataModel,
		actionName: string,
		parameters: {
			key: string;
			value: string | number | boolean | string[] | number[] | object[];
		}[]
	): Promise<K> {
		const oOperation = model.bindContext(`${actionName}(...)`);

		parameters.forEach((parameter) =>
			oOperation.setParameter(parameter.key, parameter.value)
		);

		try {
			await oOperation.execute();
			const result = oOperation.getBoundContext().getObject() as K;

			return result;
		} catch (error) {
			throw new Error(typeof error === "string" ? error : "Request failed");
		}
	}
}
