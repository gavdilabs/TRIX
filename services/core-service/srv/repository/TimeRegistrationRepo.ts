import { TimeRegistration as TimeRegistrationData } from "../utils/entities/trix/core";
import {
  CDS_DISPATCHER,
  Inject,
  Repository,
  Service,
} from "@dxfrontier/cds-ts-dispatcher";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import {
  getDateAtEndOfWeek,
  getDateAtStartOfWeek,
  getWeekNumberOfDate,
} from "../lib/utils/dates";
import { RegistrationHours } from "../lib/utils/types";
import { entities } from "@sap/cds";

const { TimeRegistration } = entities;

@Repository()
export default class TimeRegistrationRepository extends BaseRepository<TimeRegistrationData> {
  private logger: Logger;

  @Inject(CDS_DISPATCHER.SRV)
  private core: Service;

  constructor() {
    super(TimeRegistrationData);

    this.logger = LoggerFactory.createLogger("time-registration-repo");
  }

  public async getLatestRegistrationBefore(
    userId: string,
    startDate: Date
  ): Promise<TimeRegistrationData | undefined> {
    try {
      const query = SELECT.from(TimeRegistration)
        .where(
          `user.userID = '${userId}' AND endDate < '${startDate
            .toISOString()
            .substring(0, 10)}'`
        )
        .limit(1, 0)
        .orderBy("endDate desc");

      const result: TimeRegistrationData[] = await this.core.run(query);
      return result?.length > 0 ? result[0] : undefined;
    } catch (e) {
      this.logger.error(
        "Failed to find latest recorded record by user",
        userId,
        e
      );
      throw new Error("Failed to find latest recorded record by user");
    }
  }

  public async getHoursRecordedInWeek(
    userID: string,
    weekNumber: number,
    year?: string
  ): Promise<RegistrationHours> {
    try {
      const date = new Date();
      if (year) {
        date.setFullYear(parseInt(year));
      }

      const currentWeekNo = getWeekNumberOfDate(date);
      const deltaWeekNo = currentWeekNo - weekNumber;
      date.setDate(date.getDate() - deltaWeekNo * 7);

      const startDate = getDateAtStartOfWeek(date)
        .toISOString()
        .substring(0, 10);
      const endDate = getDateAtEndOfWeek(date).toISOString().substring(0, 10);

      const query = SELECT.from(TimeRegistration)
        .where(
          `user.userID = '${userID}' AND startDate >= '${startDate}' AND endDate <= '${endDate}'`
        )
        .columns("");

      const entities: TimeRegistrationData[] = await this.core.run(query);
      const result = { workHours: 0, absenceHours: 0 };

      for (const el of entities) {
        if (!el.allocation || !el.amount) continue;
        if (el.allocation.isAbsence) {
          result.absenceHours += el.amount ?? 0;
          continue;
        }

        result.workHours += el.amount ?? 0;
      }

      return result;
    } catch (e) {
      this.logger.error("Failed to get hours recorded during week", e);
      throw new Error("Failed to get hours recorded during week");
    }
  }
}
