import { RegistrationType } from "../../utils/entities/trix/core";
import { getRegistrationTypes } from "../../utils/entities/TrixCoreService";
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
export default class RegistrationTypesHandler {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("getRegistrationTypes");
  }

  @OnFunction(getRegistrationTypes)
  public async onGetRegistrationTypes(
    req: ActionRequest<typeof getRegistrationTypes>,
    next: Function
  ): ActionReturn<typeof getRegistrationTypes> {
    this._logger.trace("Returning available registration types");
    return Object.entries(RegistrationType).map(([k, v]) => ({
      name: k,
      index: v,
    }));
  }
}
