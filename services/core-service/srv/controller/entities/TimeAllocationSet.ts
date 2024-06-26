import { TimeAllocationSet } from "../../utils/entities/TrixCoreService";
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
import {
  AllocationCreatedContext,
  AllocationDeletedContext,
  AllocationUpdatedContext,
  ServiceEvents,
} from "../../lib/utils/events";
import LoggingMiddleware from "../../middleware/LoggingMiddleware";

@EntityHandler(TimeAllocationSet)
@Use(LoggingMiddleware)
export default class TimeAllocationSetHandler {
  private _logger: Logger;

  @Inject(CDS_DISPATCHER.SRV)
  private srv: Service;

  constructor() {
    this._logger = LoggerFactory.createLogger("time-allocation-set");
  }

  @AfterCreate()
  public async emitCreationEvent(
    @Req() req: TypedRequest<TimeAllocationSet>,
    @Next() next: NextEvent
  ): Promise<unknown> {
    this._logger.debug("Emitting creation event");

    const eventData: AllocationCreatedContext = {
      allocation: {
        id: req.data.ID,
        isAbsence: req.data.isAbsence,
        validFrom: req.data.validFrom,
        validTo: req.data.validTo,
      },
    };
    this.srv.emit(ServiceEvents.AllocationCreated, eventData);
    return next(req);
  }

  @AfterUpdate()
  public async emitUpdatedEvent(
    @Req() req: TypedRequest<TimeAllocationSet>,
    @Next() next: NextEvent
  ): Promise<unknown> {
    this._logger.debug("Emitting update event");

    const eventData: AllocationUpdatedContext = {
      allocation: {
        id: req.data.ID,
        isAbsence: req.data.isAbsence,
        validFrom: req.data.validFrom,
        validTo: req.data.validTo,
      },
    };

    this.srv.emit(ServiceEvents.AllocationUpdated, eventData);
    return next(req);
  }

  @AfterDelete()
  public async emitDeletedEvent(
    @Req() req: TypedRequest<TimeAllocationSet>,
    @Next() next: NextEvent
  ): Promise<unknown> {
    this._logger.debug("Emitting deletion event");

    const eventData: AllocationDeletedContext = {
      allocation: {
        id: req.data.ID,
        isAbsence: req.data.isAbsence,
        validFrom: req.data.validFrom,
        validTo: req.data.validTo,
      },
    };
    this.srv.emit(ServiceEvents.AllocationDeleted, eventData);
    return next(req);
  }
}
