import { RestService } from "@gavdi/cap-service-core";
import { Request } from "@sap/cds";
import { ConnectionError, ValidationError } from "./errors";
import { buildQuery, WorkCalendarEndpoint } from "./query";
import {
    calcEndTimeParams,
    calcStartTimeParams,
    DateConvToFactD,
    DayAttributes,
    FactoryCalendarAttributes,
    FactoryCalendars,
    getDateFromFactorydateParams,
    getDayAttributesParams,
    getFactoryCalAttributesParams,
    getFactoryCalendarsParams,
    getFactorydateFromDateParams,
    getHolidayCalendarsParams,
    getWeekdayFromDateParams,
    HolidayCalendars,
    Weekday,
    WorkCalendarDateTime,
    WorkCalendarParams,
    XSDate_D
} from "./types";
import {
    isValidCalcEndTimeParams,
    isValidCalcStartTimeParams,
    isValidGetDateFromFactoryDateParams,
    isValidGetDayAttributesParams,
    isValidGetFactoryCalAttributesParams,
    isValidGetFactoryCalendarsParams,
    isValidGetFactorydateFromDateParams,
    isValidGetHolidayCalendarsParams,
    isValidGetWeekdayFromDateParams,
    ValidationMethod
} from "./validation";

/**
 * Remote service definition for BTP Work Calendar service.
 *
 * Comes with predefined query methods for all available endpoints with validation.
 * See: https://api.sap.com/api/WorkCalendar/overview
 */
export default class WorkCalendarService extends RestService {

    constructor() {
        super("workcal");
    }

    /**
     * Calls remote service endpoint 'calcEndTime' based on given params.
     *
     * In case of invalid parameters or connection problems, an error will be thrown.
    */
    public async calcEndTime(
        params: calcEndTimeParams,
        req?: Request,
    ): Promise<WorkCalendarDateTime|undefined> {
        return await this.queryEndpoint<calcEndTimeParams, WorkCalendarDateTime>(
            WorkCalendarEndpoint.calcEndTime,
            params,
            isValidCalcEndTimeParams,
            req
        );
    }

    /**
     * Calls remote service endpoint 'calcStartTime' based on given params.
     *
     * In case of invalid parameters or connection problems, an error will be thrown.
    */
    public async calcStartTime(
        params: calcStartTimeParams,
        req?: Request,
    ): Promise<WorkCalendarDateTime|undefined> {
        return await this.queryEndpoint<calcStartTimeParams, WorkCalendarDateTime>(
            WorkCalendarEndpoint.calcStartTime,
            params,
            isValidCalcStartTimeParams,
            req
        );
    }

    /**
     * Calls remote service endpoint 'getDayAttributes' based on given params.
     *
     * In case of invalid parameters or connection problems, an error will be thrown.
    */
    public async getDayAttributes(
        params: getDayAttributesParams,
        req?: Request,
    ): Promise<DayAttributes|undefined> {
        return await this.queryEndpoint<getDayAttributesParams, DayAttributes>(
            WorkCalendarEndpoint.getDayAttributes,
            params,
            isValidGetDayAttributesParams,
            req
        );
    }

    /**
     * Calls remote service endpoint 'getFactoryCalAttributes' based on given params.
     *
     * In case of invalid parameters or connection problems, an error will be thrown.
    */
    public async getFactoryCalAttributes(
        params: getFactoryCalAttributesParams,
        req?: Request,
    ): Promise<FactoryCalendarAttributes|undefined> {
        return await this.queryEndpoint<getFactoryCalAttributesParams, FactoryCalendarAttributes>(
            WorkCalendarEndpoint.getFactoryCalAttributes,
            params,
            isValidGetFactoryCalAttributesParams,
            req
        );
    }

    /**
     * Calls remote service endpoint 'getFactoryCalendars' based on given params.
     *
     * In case of invalid parameters or connection problems, an error will be thrown.
    */
    public async getFactoryCalendars(
        params: getFactoryCalendarsParams,
        req?: Request,
    ): Promise<FactoryCalendars|undefined> {
        return await this.queryEndpoint<getFactoryCalendarsParams,FactoryCalendars>(
            WorkCalendarEndpoint.getFactoryCalendars,
            params,
            isValidGetFactoryCalendarsParams,
            req
        );
    }

    /**
     * Calls remote service endpoint 'getHolidayCalendars' based on given params.
     *
     * In case of invalid parameters or connection problems, an error will be thrown.
    */
    public async getHolidayCalendars(
        params: getHolidayCalendarsParams,
        req?: Request,
    ): Promise<HolidayCalendars|undefined> {
        return await this.queryEndpoint<getHolidayCalendarsParams,HolidayCalendars>(
            WorkCalendarEndpoint.getHolidayCalendars,
            params,
            isValidGetHolidayCalendarsParams,
            req
        );
    }

    /**
     * Calls remote service endpoint 'getWeekdayFromDate' based on given params.
     *
     * In case of invalid parameters or connection problems, an error will be thrown.
    */
    public async getWeekdayFromDate(
        params: getWeekdayFromDateParams,
        req?: Request,
    ): Promise<Weekday|undefined> {
        return await this.queryEndpoint<getWeekdayFromDateParams,Weekday>(
            WorkCalendarEndpoint.getWeekdayFromDate,
            params,
            isValidGetWeekdayFromDateParams,
            req
        );
    }

    /**
     * Calls remote service endpoint 'getFactorydateFromDate' based on given params.
     *
     * In case of invalid parameters or connection problems, an error will be thrown.
    */
    public async getFactorydateFromDate(
        params: getFactorydateFromDateParams,
        req?: Request
    ): Promise<DateConvToFactD|undefined> {
        return await this.queryEndpoint<getFactorydateFromDateParams,DateConvToFactD>(
            WorkCalendarEndpoint.getFactorydateFromDate,
            params,
            isValidGetFactorydateFromDateParams,
            req
        );
    }

    /**
     * Calls remote service endpoint 'getDateFromFactorydate' based on given params.
     *
     * In case of invalid parameters or connection problems, an error will be thrown.
    */
    public async getDateFromFactorydate(
        params: getDateFromFactorydateParams,
        req?: Request,
    ): Promise<XSDate_D|undefined> {
        return await this.queryEndpoint<getDateFromFactorydateParams,XSDate_D>(
            WorkCalendarEndpoint.getDateFromFactorydate,
            params,
            isValidGetDateFromFactoryDateParams,
            req
        );
    }

    /**
     * Performs parameter and connection validation before sending query to desired endpoint.
    */
    private async queryEndpoint<P extends WorkCalendarParams,V>(
        endpoint: WorkCalendarEndpoint,
        params: P,
        isValid: ValidationMethod<P>,
        req?: Request,
    ): Promise<V|undefined> {
        if (!isValid(params)) {
            throw new ValidationError("Invalid parameters");
        }

        if (!this.GetConnection()) {
            throw new ConnectionError("No connection to remote service");
        }

        const query = buildQuery(endpoint, params);
        return req ? await this.GetConnection()?.transaction(req).get(query) :
            await this.GetConnection()?.get(query);
    }
}
