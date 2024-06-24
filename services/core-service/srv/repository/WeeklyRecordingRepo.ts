import { WeeklyRecording as EntityData } from "#cds-models/trix/core";
import {
  CDS_DISPATCHER,
  Inject,
  Repository,
  Service,
} from "@dxfrontier/cds-ts-dispatcher";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import {
  getDate16WeeksEarlier,
  getDateAtEndOfWeek,
  getDateAtStartOfWeek,
} from "../lib/utils/dates";
import { RegistrationHours } from "../lib/utils/types";
import cds from "@sap/cds";

const { WeeklyRecording } = cds.entities;

@Repository()
export default class WeeklyRecordingRepo extends BaseRepository<EntityData> {
  private logger: Logger;

  @Inject(CDS_DISPATCHER.SRV)
  private core: Service;

  constructor() {
    super(EntityData);

    this.logger = LoggerFactory.createLogger("weekly-recording-repo");
  }

  public async findLast16Weeks(
    registrationDate: string,
    weekNo: string | number,
    userId: string
  ): Promise<EntityData[]> {
    this.logger.debug("Finding records from the last 16 weeks", userId, weekNo);

    const startInterval = getDateAtStartOfWeek(
      getDate16WeeksEarlier(registrationDate)
    );

    const endInterval = getDateAtEndOfWeek(new Date(registrationDate));
    const query = SELECT.from(WeeklyRecording)
      .where(`user.userID = ${userId}`)
      .where(`weekStart >= '${startInterval.toISOString().substring(0, 10)}'`)
      .where(`weekEnd <= '${endInterval.toISOString().substring(0, 10)}'`)
      .limit(17, 0);

    return await this.core.run(query);
  }

  public async upsertRecordedHours(
    userID: string,
    weekNo: number | string,
    year: number | string,
    hours: RegistrationHours,
    latestRegistrationDate: Date
  ): Promise<void> {
    const weekStart = getDateAtStartOfWeek(latestRegistrationDate);
    const weekEnd = getDateAtEndOfWeek(latestRegistrationDate);
    const recordKey = this.createRecordKey(weekNo, year);
    const entity: EntityData = {
      user_userID: userID,
      record: recordKey,
      year: +year,
      weekNumber: +weekNo,
      workHours: hours.workHours,
      absenceHours: hours.absenceHours,
      weekStart: weekStart.toISOString().substring(0, 10),
      weekEnd: weekEnd.toISOString().substring(0, 10),
    };

    await this.core.run(UPSERT.into(WeeklyRecording).entries([entity]));
  }

  private createRecordKey(
    weekNo: number | string,
    year: number | string
  ): string {
    return `${year}-${weekNo}`;
  }
}
