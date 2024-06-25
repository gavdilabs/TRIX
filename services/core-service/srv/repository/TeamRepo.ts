import { Team } from "../utils/entities/trix/core";
import { Repository } from "@dxfrontier/cds-ts-dispatcher";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";

@Repository()
export default class TeamRepository extends BaseRepository<Team> {
  constructor() {
    super(Team);
  }
}
