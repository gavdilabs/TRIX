import { EntityHandler, Use } from "@dxfrontier/cds-ts-dispatcher";
import { UserSet } from "../../utils/entities/TrixCoreService";
import LoggingMiddleware from "../../middleware/LoggingMiddleware";
import { Logger, LoggerFactory } from "@gavdi/caplog";

@EntityHandler(UserSet)
@Use(LoggingMiddleware)
export default class UserSetHandler {
  private logger: Logger;

  constructor() {
    this.logger = LoggerFactory.createLogger("user-set");
  }
}
