/**
 * Helper Class for Date Arithemtic functions
 */

import { CalendarView } from "../dataHandlers/ApplicationModelHandler";
import { Day } from "../model/interfaces";

export default class DateHelper {
	/**
	 * Returns array of all dates from start to end
	 * @param startDate date to start from (including)
	 * @param endDate date to end on (including)
	 */
	public static getDateRangeArray(startDate: Date, endDate: Date): Date[] {
		const datesOut: Date[] = [startDate];
		let dateStartIncrement = new Date(startDate.getTime());
		while (!this.datesEqual(dateStartIncrement, endDate)) {
			datesOut.push(dateStartIncrement);
			dateStartIncrement = new Date(
				dateStartIncrement.setDate(dateStartIncrement.getDate() + 1)
			);
		}

		return datesOut;
	}

	/**
	 * Returns a 2 spaced Date tuple [from,to]
	 * @param inputDate inputDate to calculate from, defaults to today
	 * @param mode DAY | WEEK | MONTH | YEAR enum value
	 * @returns Tuple of 2 dates [from,to]
	 */
	public static getStartEndDates(
		inputDate: Date = new Date(),
		mode: CalendarView
	): [Date, Date] {
		switch (mode) {
			case CalendarView.DAY:
				return [inputDate, inputDate];
			case CalendarView.WEEK:
				return [
					DateHelper.getNearestDayDate(inputDate, Day.MONDAY),
					DateHelper.getNearestDayDate(inputDate, Day.SUNDAY, false),
				];
			case CalendarView.MONTH: {
				return [
					new Date(inputDate.getFullYear(), inputDate.getMonth(), 1),
					new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0),
				];
			}
		}
	}

	/**
	 * Function to ie. get the closest Monday Day looking forward of backward from inputdate
	 * @param inputDate Start date
	 * @param day2find which Day to look for Monday, Tuesday etc.
	 * @param lookBack Should we look back or forward?
	 * @returns Date for the found Day
	 */
	public static getNearestDayDate(
		inputDate: Date,
		day2find: Day,
		lookBack: boolean = true
	): Date {
		if (!inputDate) {
			throw new Error("Date input missing for getNearestDayDate function");
		}

		if ((inputDate.getDay() as Day) === day2find) {
			return inputDate;
		} else {
			//inc/De-crement date
			const newDate2Check = new Date(
				inputDate.setDate(inputDate.getDate() + (lookBack ? -1 : +1))
			);
			return DateHelper.getNearestDayDate(newDate2Check, day2find, lookBack);
		}
	}

	/**
	 * Returns the time part from a Date object in 'hh:mm:ss' format
	 * @param date Input date to parse time from
	 * @returns string rep in 'hh:mm:ss' format
	 */
	public static dateAsSimpleTimeFormat(date: Date): string {
		const hours: string =
			date.getHours() >= 10 ? `${date.getHours()}` : `0${date.getHours()}`;
		const minutes: string =
			date.getMinutes() >= 10
				? `${date.getMinutes()}`
				: `0${date.getMinutes()}`;
		const seconds: string =
			date.getSeconds() >= 10
				? `${date.getSeconds()}`
				: `0${date.getSeconds()}`;

		return `${hours}:${minutes}:${seconds}`;
	}

	/**
	 * Returns the date part from a Date object in 'yyyy-MM-dd' format
	 * @param date Input date to parse string part from
	 * @returns string rep in 'yyyy-MM-dd' format
	 */
	public static dateAsSimpleFormat(date: Date): string {
		const monthStr =
			date.getMonth() + 1 >= 10
				? `${date.getMonth() + 1}`
				: `0${date.getMonth() + 1}`;
		const dateStr =
			date.getDate() >= 10 ? `${date.getDate()}` : `0${date.getDate()}`;

		return `${date.getFullYear()}-${monthStr}-${dateStr}`;
	}

	/**
	 * Function that compare 2 dates for equality only comparing date,month and year
	 * @param date1 First date to match on
	 * @param date2 Second date to match on
	 * @returns boolean indicator of equality
	 */
	public static datesEqual(date1: Date, date2: Date): boolean {
		if (date1.getDate() !== date2.getDate()) {
			return false;
		}
		if (date1.getMonth() !== date2.getMonth()) {
			return false;
		}

		if (date1.getFullYear() !== date2.getFullYear()) {
			return false;
		}

		return true;
	}

	/**
	 * Helper function for adding/subtracting days from a Date
	 * @param inputDate
	 * @param inOrDecrementInDays
	 * @returns new Date
	 */
	public static addDaysToDate(
		inputDate: Date,
		inOrDecrementInDays: number
	): Date {
		if (!inputDate || !inputDate.getFullYear) {
			throw new Error("Please input a proper date object");
		}

		const returnDate = new Date(inputDate);
		returnDate.setDate(inputDate.getDate() + inOrDecrementInDays);
		return returnDate;
	}
}
