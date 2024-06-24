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
  BeforeCreate,
  BeforeUpdate,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import LoggingMiddleware from "../../middleware/LoggingMiddleware";
import {
  ServiceEvents,
  TimeRegistrationCreatedContext,
  TimeRegistrationDeletedContext,
  TimeRegistrationUpdatedContext,
} from "../../lib/utils/events";
import ValidationService from "../../service/internal/validation";
import RegistrationService from "../../service/internal/registration";

@EntityHandler(TimeRegistrationSet)
@Use(LoggingMiddleware)
export default class TimeRegistrationSetHandler {
  private _logger: Logger;

  @Inject(CDS_DISPATCHER.SRV)
  private srv: Service;

  @Inject(ValidationService)
  private validation: ValidationService;

  @Inject(RegistrationService)
  private registration: RegistrationService;

  constructor() {
    this._logger = LoggerFactory.createLogger("time-registration-set");
  }

  @BeforeCreate()
  @BeforeUpdate()
  public async validateIncomingRegistration(
    @Req() req: TypedRequest<TimeRegistrationSet>,
    @Next() next: NextEvent
  ): Promise<unknown> {
    const data = req.data;
    const validationResult =
      await this.validation.validateAgainstConfiguredRules(data);

    for (const res of validationResult) {
      if (res.success) continue;
      return req.error(400, res.errorMsg as string);
    }

    return next(req);
  }

  @AfterUpdate()
  @AfterCreate()
  public async updateWeeklyRecordedHours(
    @Req() req: TypedRequest<TimeRegistrationSet>,
    @Next() next: NextEvent
  ): Promise<unknown> {
    try {
      const data = req.data;
      await this.registration.updateWeeklyRecordedHours(data);
      return next(req);
    } catch (e) {
      this._logger.error("Failed to update weekly recorded hours", e);
      return req.error(500, "Failed to update weekly recorded hours");
    }
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
