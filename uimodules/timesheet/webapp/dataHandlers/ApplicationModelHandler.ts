import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { trix } from "../model/entities-core";

export interface IApplicationModel {
	showSidePanel: false;
	colors: {
		absence: string;
		attendance: string;
		service: string;
		project: string;
	};
	workHours: {
		default: {
			from: string;
			to: string;
		};
	};
}

export default class ApplicationModelHandler {
	public static readonly APPLICATION_MODEL_NAME = "ApplicationModel";
	private static instance: ApplicationModelHandler =
		new ApplicationModelHandler();
	public modelData: IApplicationModel = undefined;

	private controller: Controller = undefined;
	private colors: {
		absence: string;
		attendance: string;
		service: string;
		project: string;
	} = undefined;

	public static getInstance(): ApplicationModelHandler {
		return ApplicationModelHandler.instance;
	}

	public initialize(controller: Controller) {
		this.controller = controller;

		if (!this.controller) {
			throw new Error(
				"To initialize the ApplicationModelHandler we need a valid Controller"
			);
		}

		this.modelData = (
			this.controller
				.getOwnerComponent()
				.getModel(ApplicationModelHandler.APPLICATION_MODEL_NAME) as JSONModel
		).getData() as IApplicationModel;
	}

	public getColorByAllocationType(
		appointmentType: trix.core.AllocationType,
		isAttendance: boolean = false
	): string {
		if ((appointmentType as string) === "Attendance") {
			return this.modelData.colors.attendance;
		}

		switch (appointmentType) {
			case trix.core.AllocationType.AbsenceAttendance:
				return isAttendance
					? this.modelData.colors.attendance
					: this.modelData.colors.absence;
			case trix.core.AllocationType.Project:
				return this.modelData?.colors.project;
			case trix.core.AllocationType.Service:
				return this.modelData?.colors.service;
		}
	}
}
