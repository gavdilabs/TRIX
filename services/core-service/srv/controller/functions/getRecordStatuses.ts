import { RecordStatus } from "#cds-models/trix/core";
import { getRecordStatuses } from "#cds-models/TrixCoreService";
import {
  OnFunction,
  ActionRequest,
  ActionReturn,
  UnboundActions,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";

@UnboundActions()
export default class RecordStatusHandler {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("getRecordStatuses");
  }

  @OnFunction(getRecordStatuses)
  public async onGetRecordStatuses(
    req: ActionRequest<typeof getRecordStatuses>,
    next: Function
  ): ActionReturn<typeof getRecordStatuses> {
    this._logger.trace("Returning available record statuses");
    return Object.entries(RecordStatus).map(([k, v]) => ({
      name: k,
      index: v,
    }));
  }
}
