import { TimeAllocation as EntityData } from "../utils/entities/trix/core";
import { Repository } from "@dxfrontier/cds-ts-dispatcher";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";
import cds from "@sap/cds";

const { TimeAllocation } = cds.entities;

@Repository()
export default class TimeAllocationRepository extends BaseRepository<EntityData> {
  constructor() {
    super(EntityData);
  }

  public async isAllocationAbsence(ID: string): Promise<boolean> {
    const query = SELECT.from(TimeAllocation).byKey(ID).columns("isAbsence");

    const entity: EntityData = await cds.run(query);
    return entity ? entity.isAbsence ?? false : false;
  }
}
