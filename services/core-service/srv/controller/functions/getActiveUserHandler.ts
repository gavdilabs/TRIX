import {
  ActionRequest,
  ActionReturn,
  Inject,
  OnFunction,
  Req,
  UnboundActions,
  Use,
} from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import LoggingMiddleware from "../../middleware/LoggingMiddleware";
import UserService from "../../service/internal/users";
import { getActiveUser } from "../../utils/entities/TrixCoreService";

@UnboundActions()
@Use(LoggingMiddleware)
export default class GetActiveUserHandler {
  private logger: Logger;

  @Inject(UserService)
  private userSrv: UserService;

  constructor() {
    this.logger = LoggerFactory.createLogger("get-active-user");
  }

  @OnFunction(getActiveUser)
  public async onGetActiveUser(
    @Req() req: ActionRequest<typeof getActiveUser>
  ): ActionReturn<typeof getActiveUser> {
    try {
      if (!req.user.id) {
        this.logger.error("Invalid user for getActiveUser request");
        return req.error(400, "Invalid user request");
      }

      const result = await this.userSrv.getUserOrGenerate(req.user.id);
      if (!result) {
        this.logger.error(
          "Failed to find requesting user on platform or solution"
        );
        return req.error(404, "Failed to find requesting user in system");
      }

      return result;
    } catch (e) {
      this.logger.error(
        "Unexpected error occured while fetching active user",
        e
      );
      return req.error(
        500,
        "Unexpected error occured while fetching active user"
      );
    }
  }
}
