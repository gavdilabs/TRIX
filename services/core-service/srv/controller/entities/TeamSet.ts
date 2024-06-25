import { TeamSet } from "../../utils/entities/TrixCoreService";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import {
  ActionRequest,
  ActionReturn,
  EntityHandler,
  OnBoundFunction,
  OnFunction,
  Req,
} from "@dxfrontier/cds-ts-dispatcher";
import cds from "@sap/cds";

@EntityHandler(TeamSet)
export default class TeamSetHandler {
  private logger: Logger;

  constructor() {
    this.logger = LoggerFactory.createLogger("team-set-handler");
  }

  @OnBoundFunction(TeamSet.actions.getTeamSize)
  public async onGetTeamSize(
    @Req() req: ActionRequest<typeof TeamSet.actions.getTeamSize>
  ): ActionReturn<typeof TeamSet.actions.getTeamSize> {
    try {
      const query = req.query as SELECT<TeamSet>;
      if (!query) return;
      query?.columns("members.userID");
      const res: TeamSet = await cds.run(req.query);
      return res.members?.length;
    } catch (e) {
      this.logger.error("Failed to get team size", e);
      req.error(500, "Failed to get team size");
    }
  }
}
