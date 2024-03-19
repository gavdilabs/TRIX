
/**
 * Interface abstraction for Work Calendar service related errors.
 */
export interface IWorkCalendarError {
    getStatusCode: () => number;
}

/**
 * Validation error
*/
export class ValidationError extends Error implements IWorkCalendarError {

    constructor(msg: string) {
        super(msg);

        Error.captureStackTrace(this, this.constructor);
        this.name = "ValidationError";
    }

    public getStatusCode(): number {
        return 400;
    }

}

/**
 * Invalid parameters error
*/
export class InvalidParamsError extends Error implements IWorkCalendarError {

    constructor(msg: string) {
        super(msg);

        Error.captureStackTrace(this, this.constructor);
        this.name = "InvalidParamsError";
    }

    public getStatusCode(): number {
        return 400;
    }

}

/**
 * Connection error
*/
export class ConnectionError extends Error implements IWorkCalendarError {

    constructor(msg: string) {
        super(msg);

        Error.captureStackTrace(this, this.constructor);
        this.name = "ConnectionError";
    }

    public getStatusCode(): number {
        return 500;
    }

}

/**
 * Utility method for determining whether error thrown is a work calendar error
*/
export function isWorkCalendarError(err: object): boolean {
    return 'getStatusCode' in err;
}
