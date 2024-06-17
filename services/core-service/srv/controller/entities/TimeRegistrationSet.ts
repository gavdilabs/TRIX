import { TimeRegistrationEventContext } from "#cds-models/trix/core";
import { TimeRegistrationSet } from "#cds-models/TrixCoreService";
import {
  EntityHandler,
  Use,
  AfterCreate,
  AfterUpdate,
  AfterDelete,
  TypedRequest,
  Next,
  Req,
  NextEvent,
  Inject,
  CDS_DISPATCHER,
  Service,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import LoggingMiddleware from "../../middleware/LoggingMiddleware";
import {
  ServiceEvents,
  TimeRegistrationCreatedContext,
  TimeRegistrationDeletedContext,
  TimeRegistrationUpdatedContext,
} from "../../lib/utils/events";

@EntityHandler(TimeRegistrationSet)
@Use(LoggingMiddleware)
export default class TimeRegistrationSetHandler {
  private _logger: Logger;

  @Inject(CDS_DISPATCHER.SRV)
  private srv: Service;

  constructor() {
    this._logger = LoggerFactory.createLogger("time-registration-set");
  }

  @AfterCreate()
  public async emitCreationEvent(
    @Req() req: TypedRequest<TimeRegistrationSet>,
    @Next() next: NextEvent
  ): Promise<unknown> {
    this._logger.debug("Emitting creation event");

    const eventData: TimeRegistrationCreatedContext = {
      registration: {
        id: req.data.ID,
        startDate: req.data.startDate,
        endDate: req.data.endDate,
        startTime: req.data.startTime,
        endTime: req.data.endTime,
        wholeDay: req.data.wholeDay,
        amount: req.data.amount,
        registrationStatus: req.data.registrationStatus,
        registrationType: req.data.registrationType,
        comment: req.data.comment,
        invalid: req.data.invalid,
        statusContext: req.data.statusContext,
        recordStatus: req.data.recordStatus,
      },
      user: {
        userID: req.data.user_userID,
      },
    };

    this.srv.emit(ServiceEvents.TimeRegistrationCreated, eventData);
    return next(req);
  }

  @AfterUpdate()
  public async emitUpdatedEvent(
    @Req() req: TypedRequest<TimeRegistrationSet>,
    @Next() next: NextEvent
  ): Promise<unknown> {
    this._logger.debug("Emitting update event");

    const eventData: TimeRegistrationUpdatedContext = {
      registration: {
        id: req.data.ID,
        startDate: req.data.startDate,
        endDate: req.data.endDate,
        startTime: req.data.startTime,
        endTime: req.data.endTime,
        wholeDay: req.data.wholeDay,
        amount: req.data.amount,
        registrationStatus: req.data.registrationStatus,
        registrationType: req.data.registrationType,
        comment: req.data.comment,
        invalid: req.data.invalid,
        statusContext: req.data.statusContext,
        recordStatus: req.data.recordStatus,
      },
      user: {
        userID: req.data.user_userID,
      },
    };

    this.srv.emit(ServiceEvents.TimeRegistrationUpdated, eventData);
    return next(req);
  }

  @AfterDelete()
  public async emitDeletedEvent(
    @Req() req: TypedRequest<TimeRegistrationSet>,
    @Next() next: NextEvent
  ): Promise<unknown> {
    this._logger.debug("Emitting delete event");

    const eventData: TimeRegistrationDeletedContext = {
      registration: {
        id: req.data.ID,
        startDate: req.data.startDate,
        endDate: req.data.endDate,
        startTime: req.data.startTime,
        endTime: req.data.endTime,
        wholeDay: req.data.wholeDay,
        amount: req.data.amount,
        registrationStatus: req.data.registrationStatus,
        registrationType: req.data.registrationType,
        comment: req.data.comment,
        invalid: req.data.invalid,
        statusContext: req.data.statusContext,
        recordStatus: req.data.recordStatus,
      },
      user: {
        userID: req.data.user_userID,
      },
    };

    this.srv.emit(ServiceEvents.TimeRegistrationDeleted, eventData);
    return next(req);
  }
}
