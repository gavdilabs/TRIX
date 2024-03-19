import { ManagerSet } from "#cds-models/TrixCoreService";
import { Repository } from "@dxfrontier/cds-ts-dispatcher";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";

@Repository()
export default class ManagerRepository extends BaseRepository<ManagerSet> {
  constructor() {
    super(ManagerSet);
  }
}
