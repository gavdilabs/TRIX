import { WorkWeek } from "#cds-models/trix/core";
import { Repository } from "@dxfrontier/cds-ts-dispatcher";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";

@Repository()
export default class WorkWeekRepository extends BaseRepository<WorkWeek> {
  constructor() {
    super(WorkWeek);
  }
}
