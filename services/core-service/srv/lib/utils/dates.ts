const MAX_WEEKS_IN_YEAR = 52;
const SIXTEEN_WEEKS = 16;
const WEEK_LENGTH = 7;
const DAY_IN_MS = 86400000;

export interface DateElements {
  year: string;
  month: string;
  day: string;
}

export interface TimeElements {
  hours: string;
  minutes: string;
  seconds: string;
}

export function constructFromTimeAndDate(date: string, time: string): Date {
  const de = extractDateElementsFromString(date);
  const te = extractTimeElementsFromString(time);
  return new Date(
    `${de.year}-${de.month}-${de.day}T${te.hours}:${te.minutes}:${te.seconds}`
  );
}

export function extractDateElementsFromString(date: string): DateElements {
  const parts = date.split("-");
  return {
    day: parts[0],
    month: parts[1],
    year: parts[2],
  };
}

export function extractTimeElementsFromString(time: string): TimeElements {
  const parts = time.split(":");
  return {
    hours: parts[0],
    minutes: parts[1],
    seconds: parts[2],
  };
}

export function getDateAtStartOfWeek(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + (1 - result.getDay()));
  return result;
}

export function getDateAtEndOfWeek(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + (6 - result.getDay()) + 1);
  return result;
}

export function getWeekNumberOfDate(date: Date): number {
  const tmp = new Date(date);
  tmp.setDate(tmp.getDate() - 1);

  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / DAY_IN_MS + 1) / 7);
}

export function getWeekNo16WeeksEarlier(weekNo: number): number {
  const delta = weekNo - SIXTEEN_WEEKS;
  return delta < 0 ? MAX_WEEKS_IN_YEAR + delta : delta;
}

export function getDate16WeeksEarlier(date: string | Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - SIXTEEN_WEEKS * WEEK_LENGTH);
  return result;
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export function getDayIndicator(date: Date): DayOfWeek {
  return date.getDay();
}

export function isDayAfter(startDate: Date, endDate: Date): boolean {
  return endDate.getDay() > startDate.getDay();
}

export function getNextDay(date: Date, time?: string): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + 1);

  return !time ? result : getDateWithNewTime(result, time);
}

export function getDateWithNewTime(date: Date, time: string): Date {
  return new Date(`${date.toISOString().substring(0, 10)}T${time}`);
}
