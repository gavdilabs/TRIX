import { ApprovalType } from "#cds-models/trix/admin";
import { getApprovalTypes } from "#cds-models/TrixAdminService";
import {
  OnFunction,
  ActionRequest,
  ActionReturn,
  UnboundActions,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";

@UnboundActions()
export default class ApprovalTypesHandler {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("getApprovalTypes");
  }

  @OnFunction(getApprovalTypes)
  public async onGetApprovalTypes(
    req: ActionRequest<typeof getApprovalTypes>,
    next: Function
  ): ActionReturn<typeof getApprovalTypes> {
    this._logger.trace("Returning available approval types");
    return Object.entries(ApprovalType).map(([k, v]) => ({
      name: k,
      index: v,
    }));
  }
}
