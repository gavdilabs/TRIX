import { WorkCalendarEndpoint } from "./query";
import {
    calcEndTimeParams,
    calcStartTimeParams,
    getDateFromFactorydateParams,
    getDayAttributesParams,
    getFactoryCalAttributesParams,
    getFactoryCalendarsParams,
    getFactorydateFromDateParams,
    getHolidayCalendarsParams,
    getWeekdayFromDateParams,
    ParamDiscriminator,
    WorkCalendarParams
} from "./types";

/**
 * Determines whether the provided ID is valid in accordance with the Work Calendar API.
 * For more info: https://api.sap.com/api/WorkCalendar/resource/Default
 */
export function isValidLanguageId(languageId: string): boolean {
    return languageId?.length === 2;
}

/**
 * Determines whether the provided date string is valid in accordance with the Work Calendar API.
 * Format is expected to be YYYY-MM-DD.
 *
 * For more info: https://api.sap.com/api/WorkCalendar/resource/Default
 */
export function isValidDateString(date: string): boolean {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(regEx)) return false;  // Invalid format

    const d = new Date(date);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date

    return d.toISOString().slice(0, 10) === date; // Double check on formatting
}

/**
 * Determines whether the provided time string is valid in accordance with the Work Calendar API.
 * Format is expected to be HH:MM or HH:MM:SS.
 *
 * For more info: https://api.sap.com/api/WorkCalendar/resource/Default
 */
export function isValidTimeString(time: string): boolean {
    const reqEx = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;
    return !!time.match(reqEx);
}

/**
 * Determines whether the provided string is valid in accordance with the Work Calendar API and the ISO 8601 standard.
 *
 * For more info: https://api.sap.com/api/WorkCalendar/resource/Default
 * And for info on ISO 8601: https://en.wikipedia.org/wiki/ISO_8601
 */
export function isValidISO8601(iso: string): boolean {
    const regEx = /^P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?$/;
    return regEx.test(iso);
}

/**
 * Type abstraction for validation methods
 */
export type ValidationMethod<T extends WorkCalendarParams> = (params: T) => boolean;

/**
* Validates the parameters used for the calcEndTime endpoint for BTP Work Calendar
*/
export function isValidCalcEndTimeParams(params: calcEndTimeParams): boolean {
    if (!isValidISO8601(params.durationIso8601)) return false;
    else if (!isValidDateString(params.startDate)) return false;

    return isValidTimeString(params.startTime);
}

/**
* Validates the parameters used for the calcStartTime endpoint for BTP Work Calendar
*/
export function isValidCalcStartTimeParams(params: calcStartTimeParams): boolean {
    if (!isValidISO8601(params.durationIso8601)) return false;
    else if (!isValidDateString(params.endDate)) return false;

    return isValidTimeString(params.endTime);
}

/**
* Validates the parameters used for the getDayAttributes endpoint for BTP Work Calendar
*/
export function isValidGetDayAttributesParams(params: getDayAttributesParams): boolean {
    if (!isValidDateString(params.dateFrom)) return false;
    else if (!isValidDateString(params.dateTo)) return false;

    return isValidLanguageId(params.languageId);
}

/**
* Validates the parameters used for the getFactoryCalAttributes endpoint for BTP Work Calendar
*/
export function isValidGetFactoryCalAttributesParams(params: getFactoryCalAttributesParams): boolean {
    return isValidLanguageId(params.languageId);
}

/**
* Validates the parameters used for the getFactoryCalendars endpoint for BTP Work Calendar
*/
export function isValidGetFactoryCalendarsParams(params: getFactoryCalendarsParams): boolean {
    return isValidLanguageId(params.languageId);
}

/**
* Validates the parameters used for the getHolidayCalendars endpoint for BTP Work Calendar
*/
export function isValidGetHolidayCalendarsParams(params: getHolidayCalendarsParams): boolean {
    return isValidLanguageId(params.languageId);
}

/**
* Validates the parameters used for the getWeekdayFromDate endpoint for BTP Work Calendar
*/
export function isValidGetWeekdayFromDateParams(params: getWeekdayFromDateParams): boolean {
    return isValidDateString(params.date);
}

/**
* Validates the parameters used for the getFactorydateFromDate endpoint for BTP Work Calendar
*/
export function isValidGetFactorydateFromDateParams(params: getFactorydateFromDateParams): boolean {
    return isValidDateString(params.date);
}

/**
* Validates the parameters used for the getDateFromFactorydate endpoint for BTP Work Calendar
*
* TODO: Find a way to determine whether these params are valid without hindering performance
*/
export function isValidGetDateFromFactoryDateParams(params: getDateFromFactorydateParams): boolean {
    return true;
}

/**
 * Param validation for determining if correct object is used for endpoint query.
 * The validation is based on the default object discriminator
 */
export function isCorrectParams(
    endpoint: WorkCalendarEndpoint,
    params: WorkCalendarParams,
): boolean {
    switch (params.discriminator) {
        case ParamDiscriminator.calcEndTimeParams:
            return endpoint === WorkCalendarEndpoint.calcEndTime;
        case ParamDiscriminator.calcStartTimeParams:
            return endpoint === WorkCalendarEndpoint.calcStartTime;
        case ParamDiscriminator.getDayAttributesParams:
            return endpoint === WorkCalendarEndpoint.getDayAttributes;
        case ParamDiscriminator.getFactoryCalAttributesParams:
            return endpoint === WorkCalendarEndpoint.getFactoryCalAttributes;
        case ParamDiscriminator.getFactoryCalendarsParams:
            return endpoint === WorkCalendarEndpoint.getFactoryCalendars;
        case ParamDiscriminator.getHolidayCalendarsParams:
            return endpoint === WorkCalendarEndpoint.getHolidayCalendars;
        case ParamDiscriminator.getWeekdayFromDateParams:
            return endpoint === WorkCalendarEndpoint.getWeekdayFromDate;
        case ParamDiscriminator.getFactorydateFromDateParams:
            return endpoint === WorkCalendarEndpoint.getFactorydateFromDate;
        case ParamDiscriminator.getDateFromFactorydateParams:
            return endpoint === WorkCalendarEndpoint.getDateFromFactorydate;
        default:
            return false;
    }
}
