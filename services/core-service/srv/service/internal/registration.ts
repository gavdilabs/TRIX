import { TimeRegistrationSet } from "#cds-models/TrixCoreService";
import { Inject, ServiceLogic } from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import {
  constructFromTimeAndDate,
  getWeekNumberOfDate,
} from "../../lib/utils/dates";
import TimeRegistrationRepository from "../../repository/TimeRegistrationRepo";
import WeeklyRecordingRepo from "../../repository/WeeklyRecordingRepo";

@ServiceLogic()
export default class RegistrationService {
  private logger: Logger;

  @Inject(TimeRegistrationRepository)
  private registrationRepo: TimeRegistrationRepository;

  @Inject(WeeklyRecordingRepo)
  private weeklyRecordingRepo: WeeklyRecordingRepo;

  constructor() {
    this.logger = LoggerFactory.createLogger("registration-srv");
  }

  public async updateWeeklyRecordedHours(
    registration: TimeRegistrationSet
  ): Promise<void> {
    if (
      !registration.startDate ||
      !registration.startTime ||
      !registration.user_userID
    ) {
      return;
    }

    const startDate = constructFromTimeAndDate(
      registration.startDate,
      registration.startTime
    );

    const weekNo = getWeekNumberOfDate(startDate);
    const year = startDate.getFullYear();
    const hoursRecorded = await this.registrationRepo.getHoursRecordedInWeek(
      registration.user_userID,
      weekNo,
      "" + year
    );

    await this.weeklyRecordingRepo.upsertRecordedHours(
      registration.user_userID,
      weekNo,
      year,
      hoursRecorded
    );
  }
}
