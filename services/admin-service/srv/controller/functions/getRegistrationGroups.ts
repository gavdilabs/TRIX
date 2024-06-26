import { RegistrationGroup } from "../../utils/entities/trix/admin";
import { getRegistrationGroups } from "../../utils/entities/TrixAdminService";
import {
  OnFunction,
  ActionRequest,
  ActionReturn,
  UnboundActions,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";

@UnboundActions()
export default class RegistrationGroupsHandler {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("getRegistrationGroups");
  }

  @OnFunction(getRegistrationGroups)
  public async onGetRegistrationGroups(
    req: ActionRequest<typeof getRegistrationGroups>,
    next: Function
  ): ActionReturn<typeof getRegistrationGroups> {
    this._logger.trace("Returning available approval types");
    return Object.entries(RegistrationGroup).map(([k, v]) => ({
      name: k,
      index: v,
    }));
  }
}
