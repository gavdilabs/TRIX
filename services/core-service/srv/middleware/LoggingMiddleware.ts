import { MiddlewareImpl, Next, NextMiddleware, Request } from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";

export default class LoggingMiddleware implements MiddlewareImpl {
  private _logger: Logger;

  constructor() {
    this._logger = LoggerFactory.createLogger("middleware");
  }

  public async use(req: Request, next: NextMiddleware) {
    this._logger.debug(`Received request: ${req.event} - ${req.id}`, req.data);
    this._logger.trace(`Received request: ${req.event}`);
    return await next();
  }
}
