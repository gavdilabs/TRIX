import { ValidationType } from "../../utils/entities/trix/admin";
import { TimeRegistrationSet } from "../../utils/entities/TrixCoreService";
import { Inject, ServiceLogic } from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import {
  constructFromTimeAndDate,
  getDateWithNewTime,
  getDayIndicator,
  getNextDay,
  getWeekNumberOfDate,
  isDayAfter,
} from "../../lib/utils/dates";
import { getWorkDayFromSchedule } from "../../lib/utils/schedule";
import { ValidationMessage, ValidationResult } from "../../lib/utils/types";
import TimeAllocationRepository from "../../repository/TimeAllocationRepo";
import TimeRegistrationRepository from "../../repository/TimeRegistrationRepo";
import ValidationRulesRepo from "../../repository/ValidationRules";
import WeeklyRecordingRepo from "../../repository/WeeklyRecordingRepo";
import WorkScheduleRepository from "../../repository/WorkScheduleRepo";

@ServiceLogic()
export default class ValidationService {
  private logger: Logger;
  private readonly SIXTEEN_WEEKS = 16;
  private readonly FOURTY_EIGHT_RULE = 48;

  @Inject(ValidationRulesRepo)
  private rulesRepo: ValidationRulesRepo;

  @Inject(TimeRegistrationRepository)
  private timeRegistrationRepo: TimeRegistrationRepository;

  @Inject(WeeklyRecordingRepo)
  private recordingsRepo: WeeklyRecordingRepo;

  @Inject(TimeAllocationRepository)
  private allocationRepo: TimeAllocationRepository;

  @Inject(WorkScheduleRepository)
  private scheduleRepo: WorkScheduleRepository;

  constructor() {
    this.logger = LoggerFactory.createLogger("validation-srv");
  }

  public async validateAgainstConfiguredRules(
    data: TimeRegistrationSet
  ): Promise<ValidationResult[]> {
    if (!data.user_userID) {
      throw new Error("Invalid entry - Missing user assignment");
    }

    const userId = data.user_userID;
    const rules = await this.rulesRepo.loadValidationRules();
    const processes: Promise<number | void>[] = [];
    const result: ValidationResult[] = [];

    for (const el of rules) {
      switch (el.rule) {
        case ValidationType.ElevenHourRule:
          processes.push(
            this.validateElevenHourRule(data, userId).then((res) =>
              result.push(res)
            )
          );
          continue;
        case ValidationType.FourtyEightHourRule:
          processes.push(
            this.validateFourtyEightHourRule(data, userId).then((res) =>
              result.push(res)
            )
          );
          continue;
        case ValidationType.AbsenceInWorkHours:
          processes.push(
            this.validateAbsenceInWorkHours(data, userId).then((res) =>
              result.push(res)
            )
          );
          continue;
        default:
          continue;
      }
    }

    await Promise.all(processes);

    return result;
  }

  public async validateElevenHourRule(
    data: TimeRegistrationSet,
    userId: string
  ): Promise<ValidationResult> {
    const startDate = new Date(data.startDate as string);
    const previousEntry =
      await this.timeRegistrationRepo.getLatestRegistrationBefore(
        userId,
        startDate
      );

    if (!previousEntry) {
      return {
        success: true,
      };
    }

    const incomingRecordingTime = constructFromTimeAndDate(
      data.startDate as string,
      data.startTime as string
    );
    const previousRecordingTime = constructFromTimeAndDate(
      previousEntry.endDate as string,
      data.endTime as string
    );

    const deltaHours = Math.floor(
      Math.abs(
        incomingRecordingTime.getTime() - previousRecordingTime.getTime()
      ) / 36e5
    );

    return {
      success: deltaHours >= 11,
      errorMsg:
        deltaHours >= 11 ? undefined : ValidationMessage.ExceedElevenHourRule,
    };
  }

  public async validateFourtyEightHourRule(
    data: TimeRegistrationSet,
    userId: string
  ): Promise<ValidationResult> {
    if (!data.startDate) {
      throw new Error("Invalid registration record... cannot be validated");
    }

    const weekNo = getWeekNumberOfDate(new Date(data.startDate));
    const recordings = await this.recordingsRepo.findLast16Weeks(
      data.startDate,
      weekNo,
      userId
    );

    const sum = recordings.reduce((acc, v) => acc + (v.workHours ?? 0), 0);
    const average = (sum + (data.amount ?? 0)) / this.SIXTEEN_WEEKS;

    return {
      success: average <= this.FOURTY_EIGHT_RULE,
      errorMsg:
        average <= this.FOURTY_EIGHT_RULE
          ? undefined
          : ValidationMessage.ExceedFourtyEightHourRule,
    };
  }

  public async validateAbsenceInWorkHours(
    data: TimeRegistrationSet,
    userId: string
  ): Promise<ValidationResult> {
    if (!data.startDate || !data.startTime) {
      return {
        success: false,
        errorMsg: ValidationMessage.MissingFieldsForValidation,
      };
    }

    if (!data.allocation_ID) {
      return {
        success: false,
        errorMsg: ValidationMessage.MissingAllocationForRegistration,
      };
    }

    const isAbsence = await this.allocationRepo.isAllocationAbsence(
      data.allocation_ID
    );
    if (!isAbsence) {
      return {
        success: true,
      };
    }

    const startDate = constructFromTimeAndDate(data.startDate, data.startTime);
    const endDate =
      data.endDate && data.endTime
        ? constructFromTimeAndDate(data.endDate, data.endTime)
        : undefined;

    const weekNo = getWeekNumberOfDate(startDate);
    const schedule = await this.scheduleRepo.getUsersWorkSchedule(
      userId,
      weekNo
    );

    if (!schedule) {
      return {
        success: false,
        errorMsg: ValidationMessage.MissingSchedule,
      };
    }

    const dayOfWeek = getDayIndicator(startDate);
    const workDay = getWorkDayFromSchedule(dayOfWeek, schedule);
    if (!workDay || !workDay.startTime || !workDay.endTime) {
      return {
        success: false,
        errorMsg: ValidationMessage.MissingWorkDay,
      };
    }

    const dayStart = constructFromTimeAndDate(
      data.startDate,
      workDay.startTime
    );
    if (startDate.getTime() < dayStart.getTime()) {
      return {
        success: false,
        errorMsg: ValidationMessage.AbsenceInWorkHoursRule,
      };
    }

    if (endDate) {
      const isEndAfterMidnight = isDayAfter(startDate, endDate);
      const dayEnd =
        workDay.crossingMidnight && !isEndAfterMidnight
          ? getNextDay(endDate, workDay.endTime)
          : getDateWithNewTime(endDate, workDay.endTime);

      if (endDate.getTime() > dayEnd.getTime()) {
        return {
          success: false,
          errorMsg: ValidationMessage.AbsenceInWorkHoursRule,
        };
      }
    }

    return { success: true };
  }
}
