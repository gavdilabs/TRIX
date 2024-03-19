import { InvalidParamsError } from "./errors";
import { calcEndTimeParams, calcStartTimeParams, getDateFromFactorydateParams, getDayAttributesParams, getFactoryCalAttributesParams, getFactoryCalendarsParams, getFactorydateFromDateParams, getHolidayCalendarsParams, getWeekdayFromDateParams, WorkCalendarParams } from "./types";
import { isCorrectParams } from "./validation";

/**
 * Enum declaration that contains the endpoints supported by the BTP service Work Calendar.
 */
export enum WorkCalendarEndpoint {
    calcEndTime = "/calcEndTime",
    calcStartTime = "/calcStartTime",
    getDayAttributes = "/getDayAttributes",
    getFactoryCalAttributes = "/getFactoryCalAttributes",
    getFactoryCalendars = "/getFactoryCalendars",
    getHolidayCalendars = "/getHolidayCalendars",
    getWeekdayFromDate = "/getWeekdayFromDate",
    getFactorydateFromDate = "/getFactorydateFromDate",
    getDateFromFactorydate = "/getDateFromFactorydate",
}

/**
 * Builds a query for one of permitted endpoints on the BTP Work Calendar service
 * The query is based on the endpoint provided.
*/
export function buildQuery(
    endpoint: WorkCalendarEndpoint,
    params: WorkCalendarParams,
): string {
    if (!isCorrectParams(endpoint, params)) {
        throw new InvalidParamsError("Endpoint and params do not match");
    }

    switch(endpoint) {
        case WorkCalendarEndpoint.calcEndTime:
            const endTimeParams = params as calcEndTimeParams;
            return encodeURI(`${endpoint}?durationIso8601=${endTimeParams.durationIso8601}&factoryCalendarId=${endTimeParams.factoryCalendarId}&startDate=${endTimeParams.startDate}&startTime=${endTimeParams.startTime}`);
        case WorkCalendarEndpoint.calcStartTime:
            const startTimeParams = params as calcStartTimeParams;
            return encodeURI(`${endpoint}?durationIso8601=${startTimeParams.durationIso8601}&factoryCalendarId=${startTimeParams.factoryCalendarId}&endDate=${startTimeParams.endDate}&endTime=${startTimeParams.endTime}`);
        case WorkCalendarEndpoint.getDayAttributes:
            const dayAttrParams = params as getDayAttributesParams;
            return encodeURI(`${endpoint}?factoryCalendarId=${dayAttrParams.factoryCalendarId}&holidayCalendarId=${dayAttrParams.holidayCalendarId}&dateFrom=${dayAttrParams.dateFrom}&dateTo=${dayAttrParams.dateTo}&languageId=${dayAttrParams.languageId}`);
        case WorkCalendarEndpoint.getFactoryCalAttributes:
            const calAttrParams = params as getFactoryCalAttributesParams;
            return encodeURI(`${endpoint}?factoryCalendarId=${calAttrParams.factoryCalendarId}&languageId=${calAttrParams.languageId}`);
        case WorkCalendarEndpoint.getFactoryCalendars:
            const factCalParams = params as getFactoryCalendarsParams;
            return encodeURI(`${endpoint}?languageId=${factCalParams.languageId}`);
        case WorkCalendarEndpoint.getHolidayCalendars:
            const holCalParams = params as getHolidayCalendarsParams;
            return encodeURI(`${endpoint}?languageId=${holCalParams.languageId}`);
        case WorkCalendarEndpoint.getWeekdayFromDate:
            const weekdayParams = params as getWeekdayFromDateParams;
            return encodeURI(`${endpoint}?date=${weekdayParams.date}`);
        case WorkCalendarEndpoint.getFactorydateFromDate:
            const factDateParams = params as getFactorydateFromDateParams;
            return encodeURI(`${endpoint}?usePrevWorkDay=${factDateParams.usePrevWorkDay}&date=${factDateParams.date}&factoryCalendar=${factDateParams.factoryCalendar}`);
        case WorkCalendarEndpoint.getDateFromFactorydate:
            const dateFromParams = params as getDateFromFactorydateParams;
            return encodeURI(`${endpoint}?factoryDate=${dateFromParams.factoryDate}?factoryCalendar=${dateFromParams.factoryCalendar}`);
        default:
            throw new InvalidParamsError("Invalid endpoint");
    }
}

