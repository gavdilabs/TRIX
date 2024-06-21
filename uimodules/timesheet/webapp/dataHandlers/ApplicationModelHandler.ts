import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { trix } from "../model/entities-core";

export interface IApplicationModel {
	showSidePanel: false;
	view: string;
	viewTitle: string;
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

export enum CalendarView {
	DAY = "DayView",
	WEEK = "WeekView",
	MONTH = "MonthView",
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
	private i18nBundle: ResourceBundle = undefined;

	public static getInstance(): ApplicationModelHandler {
		return ApplicationModelHandler.instance;
	}

	public initialize(controller: Controller, i18nBundle: ResourceBundle) {
		this.controller = controller;
		this.i18nBundle = i18nBundle;

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

		//Set the current
		this.setCurrentView(this.getCurrentCalendarViewKey() as CalendarView);
	}

	public setCurrentView(viewKey: CalendarView) {
		if (!viewKey) {
			return;
		}

		const text: string = `${this.i18nBundle.getText("CalendarView", [
			this.i18nBundle.getText(`CalendarView${viewKey}`),
		])}`;

		this.upDateModelDataProperty("/view", viewKey);
		this.upDateModelDataProperty("/viewTitle", text);
	}

	public upDateModelDataProperty(
		propNameAndPath: string,
		value: object | string | number | boolean
	) {
		const model = this.controller
			.getOwnerComponent()
			.getModel(ApplicationModelHandler.APPLICATION_MODEL_NAME) as JSONModel;
		model.setProperty(propNameAndPath, value);
	}

	public getCurrentCalendarViewKey(): string {
		return this.modelData.view;
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
