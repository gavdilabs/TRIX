import { TimeAllocation as EntityData } from "../utils/entities/trix/core";
import { Repository } from "@dxfrontier/cds-ts-dispatcher";
import cds from "@sap/cds";

const { TimeAllocation } = cds.entities;

@Repository()
export default class TimeAllocationRepository {
  constructor() {}

  public async isAllocationAbsence(ID: string): Promise<boolean> {
    const query = SELECT.from(TimeAllocation).byKey(ID).columns("isAbsence");

    const entity: EntityData = await cds.run(query);
    return entity ? entity.isAbsence ?? false : false;
  }
}
