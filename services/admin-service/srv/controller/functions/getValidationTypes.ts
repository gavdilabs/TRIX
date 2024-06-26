import { ValidationType } from "../../utils/entities/trix/admin";
import { getValidationTypes } from "../../utils/entities/TrixAdminService";
import {
  OnFunction,
  ActionRequest,
  ActionReturn,
  UnboundActions,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";

@UnboundActions()
export default class ValidationTypesHandler {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("getValidationTypes");
  }

  @OnFunction(getValidationTypes)
  public async onGetRegistrationGroups(
    req: ActionRequest<typeof getValidationTypes>,
    next: Function
  ): ActionReturn<typeof getValidationTypes> {
    this._logger.trace("Returning available approval types");
    return Object.entries(ValidationType).map(([k, v]) => ({
      name: k,
      index: v,
    }));
  }
}
