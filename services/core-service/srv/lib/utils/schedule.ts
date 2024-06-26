import { WorkDay, WorkWeek } from "../../utils/entities/trix/core";
import { DayOfWeek } from "./dates";

export function getWorkDayFromSchedule(
  dayOfWeek: DayOfWeek,
  workWeek: WorkWeek
): WorkDay | undefined | null {
  switch (dayOfWeek) {
    case DayOfWeek.Monday:
      return workWeek?.monday;
    case DayOfWeek.Tuesday:
      return workWeek?.tuesday;
    case DayOfWeek.Wednesday:
      return workWeek?.wednesday;
    case DayOfWeek.Thursday:
      return workWeek?.thursday;
    case DayOfWeek.Friday:
      return workWeek?.friday;
    case DayOfWeek.Saturday:
      return workWeek?.saturday;
    case DayOfWeek.Sunday:
      return workWeek?.sunday;
    default:
      return undefined;
  }
}
