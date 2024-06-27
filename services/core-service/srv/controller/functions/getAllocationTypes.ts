import {
  ActionRequest,
  ActionReturn,
  OnFunction,
  UnboundActions,
  Use,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import LoggingMiddleware from "../../middleware/LoggingMiddleware";
import { getAllocationTypes } from "../../utils/entities/TrixCoreService";

@UnboundActions()
@Use(LoggingMiddleware)
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
    return req.error(500, "Not Implemented");
  }
}
