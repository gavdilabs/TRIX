import { RegistrationStatus } from "#cds-models/trix/core";
import { getRegistrationStatuses } from "#cds-models/TrixCoreService";
import {
  OnFunction,
  ActionRequest,
  ActionReturn,
  UnboundActions,
  Use,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import LoggingMiddleware from "../../middleware/LoggingMiddleware";

@UnboundActions()
@Use(LoggingMiddleware)
export default class RegistrationStatusHandler {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("getRegistrationStatuses");
  }

  @OnFunction(getRegistrationStatuses)
  public async onGetRegistrationStatuses(
    req: ActionRequest<typeof getRegistrationStatuses>,
    next: Function
  ): ActionReturn<typeof getRegistrationStatuses> {
    this._logger.trace("Returning available registration statuses");
    return Object.entries(RegistrationStatus).map(([k, v]) => ({
      name: k,
      index: v,
    }));
  }
}
