import { ManagerSet } from "../../utils/entities/TrixCoreService";
import { EntityHandler, Use } from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import LoggingMiddleware from "../../middleware/LoggingMiddleware";

@EntityHandler(ManagerSet)
@Use(LoggingMiddleware)
export default class ManagerSetHandler {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("manager-set");
  }
}
