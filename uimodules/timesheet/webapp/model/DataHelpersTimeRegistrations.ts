import JSONModel from "sap/ui/model/json/JSONModel";
import ModelDataHelper from "../utils/ModelDataHelper";
import DataHelper from "./DataHelper";
import {
	ITimeRegistrationAndAllocation,
	ITRIXCalendarRecord,
} from "./interfaces";
export default class DataHelpersTimeRegistrations extends DataHelper {
	public async loadPeriod(): Promise<ITRIXCalendarRecord[]> {
		const apiData = await ModelDataHelper.getModelData<
			ITimeRegistrationAndAllocation[]
		>(this.getOdataModel(), "/TimeRegistrationSet", {expand: ""});
		const periodData: ITRIXCalendarRecord[] = [];

		apiData?.forEach((data) => {
			periodData.push({
				startDate: data.startDate,
				endDate: data.endDate,
				text: data.allocation.description,
				title: "",
			});
		});
		this.getView().setModel(
			new JSONModel(periodData ? periodData : []),
			"PeriodRegistrations"
		);

		return periodData;
	}
}
