import { AllocationType } from "#cds-models/trix/core";
import { getAllocationTypes } from "#cds-models/TrixCoreService";
import {
  OnFunction,
  ActionRequest,
  ActionReturn,
  UnboundActions,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";

@UnboundActions()
export default class AllocationTypesHandler {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("getAllocationTypes");
  }

  @OnFunction(getAllocationTypes)
  public async onGetAllocationTypes(
    req: ActionRequest<typeof getAllocationTypes>,
    next: Function
  ): ActionReturn<typeof getAllocationTypes> {
    this._logger.trace("Returning available allocation types");
    return Object.values(AllocationType);
  }
}