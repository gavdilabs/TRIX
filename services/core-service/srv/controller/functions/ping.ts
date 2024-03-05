import { ping } from "#cds-models/TrixCoreService";
import {
    OnFunction,
    ActionRequest,
    ActionReturn,
    UnboundActions,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";

@UnboundActions()
export default class PingHandler {

    private _logger: Logger;

    constructor() {
        this._logger = LoggerFactory.createLogger("ping-handler");
    }

    @OnFunction(ping)
    public async onPing(
        req: ActionRequest<typeof ping>,
        next: Function,
    ): ActionReturn<typeof ping> {
        const msg = req.data.msg;
        this._logger.info(`Message received: ${msg}`);
        return "Pong";
    }

}
