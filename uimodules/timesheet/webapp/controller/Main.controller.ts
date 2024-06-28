import Event from "sap/ui/base/Event";
import TRIXCalendar from "../controls/TRIXCalendar";
import ApplicationModelHandler, {
	CalendarView,
} from "../dataHandlers/ApplicationModelHandler";
import DropDownHandler from "../dataHandlers/DropDownHandler";
import TimeRegistrationSetHandler from "../dataHandlers/TimeRegistrationSetHandler";
import TRIXCalendarEventHandler from "../eventHandlers/TRIXCalendarEventHandler";
import DateHelper from "../utils/DateHelper";
import BaseController from "./BaseController";

/**
 * @namespace trix.timesheet.controller
 */
export default class Main extends BaseController {
	private ddHandler: DropDownHandler = undefined;

	/**
	 * UI5 Hook Function - Called once on initialization
	 */
	public onInit(): void {
		this.getRouter()
			.getRoute("main")
			.attachPatternMatched(() => {
				void this.onPatternMatched();
			}, this);
	}

	/**
	 * Routing target - only firing if url has /Main
	 */
	private async onPatternMatched() {
		//ApplicationModelHandler init
		ApplicationModelHandler.getInstance().initialize(
			this,
			this.getResourceBundle()
		);

		//Initialize the Data handler(s)
		void (await TimeRegistrationSetHandler.initialize(
			this.getOdataModelCore(),
			this,
			this.getResourceBundle(),
			new Date(),
			ApplicationModelHandler.getInstance().getCurrentCalendarView() as CalendarView
		));

		//Preload some popup lists
		this.ddHandler = new DropDownHandler(
			this,
			this.getOdataModelCore()
		);

		//Preload the allocation tree data
		void (await this.ddHandler.loadAllocationTree());

		//Load last as other dependencies, formatter etc. need to use the ddhandler based on calendar data
		void (await TimeRegistrationSetHandler.getInstance().loadTimeRegistrations());

		//Set the Calendar EventHandler on the Trix Calendar
		this.getCalendarControl()?.setEventHandler(
			new TRIXCalendarEventHandler(this, this.getCalendarControl())
		);
	}

	/**
	 * Function for gettting a ref to the Calendar Control
	 * @returns an instance of a TRIXCalendar UI Control
	 */
	private getCalendarControl(): TRIXCalendar {
		return this.byId(this.createId("trixCalendar")) as TRIXCalendar;
	}

	/**
	 * Formatter: Sets configured color on the appointments
	 * @param appointmentSubtypeId Id of the TimeAllocation
	 * @returns color #hex
	 */
	public formatterAppointmentColor(appointmentSubtypeId: string) {
		if (!appointmentSubtypeId) {
			return "#FFFFFF";
		} else {
			return this.ddHandler.getTimeAllocationColor(appointmentSubtypeId);
		}
	}
/**
	 * Formatter: Sets configured color on the appointments
	 * @param appointmentSubtypeId Id of the TimeAllocation
	 * @returns color #hex
	 */
	public formatterAppointmentIcon(appointmentSubtypeId: string) {
		if (!appointmentSubtypeId) {
			return null;
		} else {
			return this.ddHandler.getTimeAllocationIcon(appointmentSubtypeId);
		}
	}

	/**
	 * Event Function for the ToggleButton "FullDay | WS Day"
	 * @param event Std. UI5 event
	 */
	public onToggleFullDay(event: Event) {
		const params = event.getParameters() as { pressed: boolean };
		this.getCalendarControl().setFullDay(params.pressed);
	}

	/**
	 * Triggers when Date View is changed on the Calendar
	 * @param event std. UI5 event
	 */
	public onCalendarChange(event: Event): void {
		const params = event.getParameters() as { date?: Date };
		const calendar: TRIXCalendar = event.getSource();
		const viewKey: string = calendar
			.getViewByViewId(calendar.getSelectedView())
			?.getKey();
		ApplicationModelHandler.getInstance().setCurrentView(
			viewKey as CalendarView
		);

		void TimeRegistrationSetHandler.updateDatesAndMode(
			params.date
				? DateHelper.addDaysToDate(params.date, 1)
				: (calendar.getStartDate() as Date),
			viewKey as CalendarView
		);
	}
}
