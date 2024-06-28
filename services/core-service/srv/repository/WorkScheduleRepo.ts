import {
  WorkSchedule as EntityData,
  WorkWeek,
} from "../utils/entities/trix/core";
import { Repository } from "@dxfrontier/cds-ts-dispatcher";
import cds from "@sap/cds";

const { WorkSchedule } = cds.entities;

@Repository()
export default class WorkScheduleRepository {
  constructor() {}

  public async getUsersWorkSchedule(
    userId: string,
    weekNo: number | string
  ): Promise<WorkWeek | undefined | null> {
    const query = SELECT.from(WorkSchedule)
      .where(`scheduleOrder = '${weekNo}'`)
      .where(`user.userID = '${userId}'`)
      .columns((el) => {
        el.week((w: any) => {
          w.monday("*"),
            w.tuesday("*"),
            w.wednesday("*"),
            w.thursday("*"),
            w.friday("*"),
            w.saturday("*"),
            w.sunday("*");
        });
      });

    const schedule: EntityData[] = await cds.run(query);
    return schedule?.length > 0 ? schedule[0]?.week : undefined;
  }
}
