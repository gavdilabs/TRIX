
/**
 * Params discriminator, used for validation of params against endpoints.
 */
export enum ParamDiscriminator {
    calcEndTimeParams = "C-E-T-P",
    calcStartTimeParams = "C-S-T-P",
    getDayAttributesParams = "G-D-A-P",
    getFactoryCalAttributesParams = "G-F-C-A-P",
    getFactoryCalendarsParams = "G-F-C-P",
    getHolidayCalendarsParams = "G-H-C-P",
    getWeekdayFromDateParams = "G-W-F-D-P",
    getFactorydateFromDateParams = "G-F-F-D-P",
    getDateFromFactorydateParams = "G-D-F-F-P",
}

/**
 * Interface abstraction for parameters for Work Calendar requests
*/
export interface WorkCalendarParams {
    discriminator: ParamDiscriminator;
}

/**
 * Parameters that can be used to query the endpoint '/calcEndTime'
 */
export interface calcEndTimeParams extends WorkCalendarParams {
    /**
     * Discriminator for param object. DO NOT ALTER!
     */
    readonly discriminator: ParamDiscriminator.calcEndTimeParams;

    /**
    * duration as ISO 8601 period; e.g. P1Y or PT1H
    */
    durationIso8601: string;
    /**
    * id for factory calendar; range of values from getFactoryCalendars
    */
    factoryCalendarId: string;
    /**
    * start date in ISO notation; e.g. 2022-01-01
    */
    startDate: string;
    /**
    * start time in ISO notation; e.g. 08:00 or 08:00:00
    */
    startTime: string;
}

/**
 * Parameters that can be used to query the endpoint '/calcStartTime'
 */
export interface calcStartTimeParams extends WorkCalendarParams {
    /**
     * Discriminator for param object. DO NOT ALTER!
     */
    readonly discriminator: ParamDiscriminator.calcStartTimeParams;

    /**
    * duration as ISO 8601 period; e.g. P1Y or PT1H
    */
    durationIso8601: string;
    /**
    * id for factory calendar; range of values from getFactoryCalendars
    */
    factoryCalendarId: string;
    /**
    * start date in ISO notation; e.g. 2022-01-01
    */
    endDate: string;
    /**
    * start time in ISO notation; e.g. 08:00 or 08:00:00
    */
    endTime: string;
}

/**
 * Parameters that can be used to query the endpoint '/getDayAttributes'
 */
export interface getDayAttributesParams extends WorkCalendarParams {
    /**
     * Discriminator for param object. DO NOT ALTER!
     */
    readonly discriminator: ParamDiscriminator.getDayAttributesParams;

    /**
    * id for factory calendar; range of values from getFactoryCalendars
    */
    factoryCalendarId: string;
    /**
    * id for holiday calendar; range of values from getHolidayCalendars
    */
    holidayCalendarId: string;
    /**
    * date from in ISO notation; e.g. 2022-01-01
    */
    dateFrom: string;
    /**
    * date to in ISO notation; e.g. 2022-01-05
    */
    dateTo: string;
    /**
    * ID of language in which values should be returned; e.g. EN
    */
    languageId: string;
}

/**
 * Parameters that can be used to query the endpoint '/getFactoryCalAttributes'
 */
export interface getFactoryCalAttributesParams extends WorkCalendarParams {
    /**
     * Discriminator for param object. DO NOT ALTER!
     */
    readonly discriminator: ParamDiscriminator.getFactoryCalAttributesParams;

    /**
    * id for factory calendar; range of values from getFactoryCalendars
    */
    factoryCalendarId: string;
    /**
    * ID of language in which values should be returned; e.g. EN
    */
    languageId: string;
}

/**
 * Parameters that can be used to query the endpoint '/getFactoryCalendars'
 */
export interface getFactoryCalendarsParams extends WorkCalendarParams {
    /**
     * Discriminator for param object. DO NOT ALTER!
     */
    readonly discriminator: ParamDiscriminator.getFactoryCalendarsParams;

    /**
    * ID of language in which values should be returned; e.g. EN
    */
    languageId: string;
}

/**
 * Parameters that can be used to query the endpoint '/getHolidayCalendars'
 */
export interface getHolidayCalendarsParams extends WorkCalendarParams {
    /**
     * Discriminator for param object. DO NOT ALTER!
     */
    readonly discriminator: ParamDiscriminator.getHolidayCalendarsParams;

    /**
    * ID of language in which values should be returned; e.g. EN
    */
    languageId: string;
}

/**
 * Parameters that can be used to query the endpoint '/getWeekdayFromDate'
 */
export interface getWeekdayFromDateParams extends WorkCalendarParams {
    /**
     * Discriminator for param object. DO NOT ALTER!
     */
    readonly discriminator: ParamDiscriminator.getWeekdayFromDateParams;

    /**
    * date in ISO notation; e.g. 2022-01-01
    */
    date: string;
}

/**
 * Parameters that can be used to query the endpoint '/getFactorydateFromDate'
 */
export interface getFactorydateFromDateParams extends WorkCalendarParams {
    /**
     * Discriminator for param object. DO NOT ALTER!
     */
    readonly discriminator: ParamDiscriminator.getFactorydateFromDateParams;

    /**
    * indicates if previous or next workday should be used in case that the actual day is not a work day
    */
    usePrevWorkDay: boolean;
    /**
    * date in ISO notation; e.g. 2022-01-01
    */
    date: string;
    /**
    * id for factory calendar; range of values from getFactoryCalendars
    */
    factoryCalendar: string;
}

/**
 * Parameters that can be used to query the endpoint '/getDateFromFactorydate'
 */
export interface getDateFromFactorydateParams extends WorkCalendarParams {
    /**
     * Discriminator for param object. DO NOT ALTER!
     */
    readonly discriminator: ParamDiscriminator.getDateFromFactorydateParams;

    /**
    * internal value for a date in factory calendar; range of values from getFactoryDateFromDate
    */
    factoryDate: number;
    /**
    * id for factory calendar; range of values from getFactoryCalendars
    */
    factoryCalendar: string;
}

/**
 * WorkCalendarDateTime is an object defined and return by the BTP service Work Calendar.
 * It is returned as part of the '/calcEndTime' and '/calcStartTime' endpoints.
 */
export interface WorkCalendarDateTime {
    date: string;
    time: string;
}

/**
 * DayAttribute is a singular object definition of the attribute returned by the BTP service Work Calendar.
 * It is returned as DayAttributes (array) from the endpoint '/getDayAttributes'.
 */
export interface DayAttribute {
    date: string;
    freedayIndicator: string;
    holidayIndicator: string;
    holidayId: string;
    holidayTextShort: string;
    holidayTextLong: string;
    weekdayNumber: string;
    weekdayName: string;
    weekdayText: string;
}

/**
 * DayAttributes is an array of attributes returned by the BTP service Work Calendar.
 * It is returned by the endpoint '/getDayAttributes'
 */
export type DayAttributes = DayAttribute[];

/**
 * FactoryCalendarAttributes is an object returned by the BTP service Work Calendar.
 * It is returned by the endpoint '/getFactoryCalAttributes'
 */
export interface FactoryCalendarAttributes {
    factoryCalendarId: string;
    languageId: string;
    factoryCalendarName: string;
    yearFrom: string;
    yearTo: string;
    mondayWorkdayIndicator: string;
    tuesdayWorkdayIndicator: string;
    wednesdayWorkdayIndicator: string;
    thursdayWorkdayIndicator: string;
    fridayWorkdayIndicator: string;
    saturdayWorkdayIndicator: string;
    sundayWorkdayIndicator: string;
    publicHolidayWorkdayInd: string;
    holidayCalendarId: string;
    factoryCalendarStartDayNo: string;
    intervalsIndicator: string;
    yearActiveFrom: string;
    yearActiveTo: string;
    terminateIndicator: string;
    changeDate: string;
    changeTime: string;
}

/**
 * FactoryCalendar is a singular object definition from the BTP service Work Calendar.
 * It is returned as as an array of objects from the '/getFactoryCalendars' endpoint
 */
export interface FactoryCalendar {
    factoryCalendarId: string;
    language: string;
    calendarTextLong: string;
}

/**
 * FactoryCalendars is an array of factory calendar objects returned by the BTP service Work Calendar.
 * It is returned by the endpoint '/getFactoryCalendars'
 */
export type FactoryCalendars = FactoryCalendar[];

/**
 * HolidayCalendar is a singular object definition from the BTP service Work Calendar.
 * It is returned as as an array of objects from the '/getHolidayCalendars' endpoint
 */
export interface HolidayCalendar {
    holidayCalendarId: string;
    language: string;
    calendarTextLong: string;
}

/**
 * HolidayCalendars is an array of factory calendar objects returned by the BTP service Work Calendar.
 * It is returned by the endpoint '/getHolidayCalendars'
 */
export type HolidayCalendars = HolidayCalendar[];

/**
 * Weekday is an object returned by the BTP service Work Calendar.
 * It is returned by the endpoint '/getWeekdayFromDate'
*/
export interface Weekday {
    number: string;
    name: string;
}

/**
 * DateConvToFactD is an object returned by the BTP service Work Calendar.
 * It is returned by the endpoint '/getFactorydateFromDate'
 */
export interface DateConvToFactD {
    date: string;
    factoryDate: number;
    usedWorkdayIndicator: string;
}

/**
 * XSDate_D is a string value definition from the BTP service Work Calendar.
 * It is returned by the endpoint '/getDateFromFactorydate'
 */
export type XSDate_D = string;

