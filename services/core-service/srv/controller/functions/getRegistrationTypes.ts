import { RegistrationType } from "#cds-models/trix/core";
import { getRegistrationTypes } from "#cds-models/TrixCoreService";
import {
  OnFunction,
  ActionRequest,
  ActionReturn,
  UnboundActions,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";

@UnboundActions()
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
