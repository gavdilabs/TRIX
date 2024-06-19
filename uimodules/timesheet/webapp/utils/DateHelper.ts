/**
 * Helper Class for Date Arithemtic functions
 */

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
}
