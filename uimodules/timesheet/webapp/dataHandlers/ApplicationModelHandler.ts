import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { trix } from "../model/entities-core";

/**
 * Interface that should match the data points available in /model/applicationModel.json
 */
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

/**
 * Enum representing the supported Calendar Views for the TRIXCalendar
 */
export enum CalendarView {
	DAY = "DayView",
	WEEK = "WeekView",
	MONTH = "MonthView",
}

/**
 * Handler/Helper class for accessing properties on the ApplicationModel configuration JSON.
 */
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

	/**
	 * Singleton accessor function
	 * @returns self
	 */
	public static getInstance(): ApplicationModelHandler {
		return ApplicationModelHandler.instance;
	}

	/**
	 * Should be called once to intialize the Singleton
	 * @param controller UI Controller
	 * @param i18nBundle i18n Resource Bundle Class instance
	 */
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
		this.setCurrentView(this.getCurrentCalendarView());
	}

	/**
	 * Setting the view currently selected in UI
	 * @param viewKey CalendarView (Day, Week, Month)
	 * @returns void
	 */
	public setCurrentView(viewKey: CalendarView): void {
		if (!viewKey) {
			return;
		}

		const text: string = `${this.i18nBundle.getText("CalendarView", [
			this.i18nBundle.getText(`CalendarView${viewKey}`),
		])}`;

		this.upDateModelDataProperty("/view", viewKey);
		this.upDateModelDataProperty("/viewTitle", text);
	}

	/**
	 * Tooling function for easy access to setting a value in the ApplicationModel
	 * @param propNameAndPath property name ie. /view or /viewTitle
	 * @param value Value to set
	 */
	public upDateModelDataProperty(
		propNameAndPath: string,
		value: object | string | number | boolean
	) {
		const model = this.controller
			.getOwnerComponent()
			.getModel(ApplicationModelHandler.APPLICATION_MODEL_NAME) as JSONModel;
		model.setProperty(propNameAndPath, value);
	}

	/**
	 * Returns the currently selected CalendarView
	 * @returns CalendarView ... ie. MonthView, WeekView etc
	 */
	public getCurrentCalendarView(): CalendarView {
		return this.modelData.view as CalendarView;
	}

	/**
	 * Get the configured Hex for the diff. main types of allocation
	 * @param appointmentType Allocation Type ie. service, project, absence .. etc.
	 * @param isAttendance boolean indicator if its absence from the grouped type Absence&Attendance
	 * @returns the configured hex color or default white
	 */
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
			default:
				return "#FFFFFF";
		}
	}
}
