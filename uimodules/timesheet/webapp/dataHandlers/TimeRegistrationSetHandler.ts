import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { trix } from "../model/entities-core";
import ModelDataHelper from "../utils/ModelDataHelper";
import { OdataListbindingWrapper } from "../utils/OdataListbindingWrapper";

export default class TimeRegistrationSetHandler {
	private static instance: TimeRegistrationSetHandler = undefined;
	private static odataModel: ODataModel = undefined;
	private static controller: Controller = undefined;

	private timeRegistrations: OdataListbindingWrapper<
    Partial<ITimeRegistration>
  > = undefined;

	public static getInstance(): TimeRegistrationSetHandler {
		if (
			!TimeRegistrationSetHandler.odataModel ||
			!TimeRegistrationSetHandler.controller
		) {
			throw new Error(
				"Cannot create instance w/o initialize() having been called first"
			);
		}

		if (!TimeRegistrationSetHandler.instance) {
			TimeRegistrationSetHandler.instance = new TimeRegistrationSetHandler();
		}

		return TimeRegistrationSetHandler.instance;
	}

	public static initialize(odataModel: ODataModel, controller: Controller) {
		TimeRegistrationSetHandler.odataModel = odataModel;
		TimeRegistrationSetHandler.controller = controller;
	}

	public async createAppointMent():Promise<Error | trix.core.ITimeRegistration> {

	}

	public async loadTimeRegistrations(
		dateFrom: Date,
		dateTo: Date
	): Promise<void> {
		let timeRegistrationsForPeriod = await ModelDataHelper.getModelData<
			trix.core.ITimeRegistration[]
		>(TimeRegistrationSetHandler.odataModel, "/TimeRegistrationSet", {
			$expand: "allocation",
		});

		timeRegistrationsForPeriod = timeRegistrationsForPeriod.filter(
			(item) => item.startDate && item.endDate
		);

		timeRegistrationsForPeriod.forEach((item) => {

            //Setup the startdate
            let [hour,minute,second] = (item.startTime as unknown as string).split(":")
			item.startDate = new Date(item.startDate);
            item.startDate.setHours(parseInt(hour));
            item.startDate.setMinutes(parseInt(minute));
            item.startDate.setSeconds(parseInt(second));

            //Setup the enddate
            [hour,minute,second] = (item.endTime as unknown as string).split(":")
			item.endDate = new Date(item.endDate);
            item.endDate.setHours(parseInt(hour));
            item.endDate.setMinutes(parseInt(minute));
            item.endDate.setSeconds(parseInt(second));
		});

		TimeRegistrationSetHandler.controller
			.getView()
			.setModel(
				new JSONModel(timeRegistrationsForPeriod),
				"PeriodRegistrations"
			);

		console.log(timeRegistrationsForPeriod);
	}
}
