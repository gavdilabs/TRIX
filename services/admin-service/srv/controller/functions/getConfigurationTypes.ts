import { ConfigurationType } from "../../utils/entities/trix/admin";
import { getConfigurationTypes } from "../../utils/entities/TrixAdminService";
import {
  OnFunction,
  ActionRequest,
  ActionReturn,
  UnboundActions,
  Use,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";

@UnboundActions()
export default class ConfigurationTypesHandler {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("getConfigurationTypes");
  }

  @OnFunction(getConfigurationTypes)
  public async onGetConfigurationTypes(
    req: ActionRequest<typeof getConfigurationTypes>,
    next: Function
  ): ActionReturn<typeof getConfigurationTypes> {
    this._logger.trace("Returning available configuration types");
    return Object.entries(ConfigurationType).map(([k, v]) => ({
      name: k,
      index: v,
    }));
  }
}
