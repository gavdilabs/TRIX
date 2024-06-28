// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../../_';
import * as _ from './../..';
import * as _sap_common from './../../sap/common';
// enum
export const RecordStatus = {
  Awaiting: 0,
  Processing: 1,
  Complete: 2,
  Error: 3,
} as const;
export type RecordStatus = 0 | 1 | 2 | 3

// enum
export const RegistrationStatus = {
  InProcess: 1,
  Complete: 2,
  Approved: 3,
  Rejected: 4,
} as const;
export type RegistrationStatus = 1 | 2 | 3 | 4

// enum
export const RegistrationType = {
  Manual: 0,
  ClockInOut: 1,
} as const;
export type RegistrationType = 0 | 1

export function _TimeAllocationGroupAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class TimeAllocationGroup extends Base {
        title?: string | null;
        description?: string | null;
        hex?: string | null;
        icon?: string | null;
        order?: number | null;
        timeAllocations?: __.Association.to.many<TimeAllocation_>;
      static actions: {
    }
  };
}
export class TimeAllocationGroup extends _._cuidAspect(_._managedAspect(_._temporalAspect(_TimeAllocationGroupAspect(__.Entity)))) {}
export class TimeAllocationGroup_ extends Array<TimeAllocationGroup> {}
Object.defineProperty(TimeAllocationGroup, 'name', { value: 'trix.core.TimeAllocationGroup' })
Object.defineProperty(TimeAllocationGroup_, 'name', { value: 'trix.core.TimeAllocationGroup' })

export function _TimeAllocationAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class TimeAllocation extends Base {
        description?: string | null;
        isAbsence?: boolean | null;
        allocationGroupId?: string | null;
        hex?: string | null;
        icon?: string | null;
        allocationGroup?: __.Association.to<TimeAllocationGroup> | null;
        allocationGroup_ID?: string | null;
        allocatedUsers?: __.Association.to.many<User2Allocation_>;
      static actions: {
    }
  };
}
export class TimeAllocation extends _._cuidAspect(_._managedAspect(_._temporalAspect(_TimeAllocationAspect(__.Entity)))) {}
export class TimeAllocation_ extends Array<TimeAllocation> {}
Object.defineProperty(TimeAllocation, 'name', { value: 'trix.core.TimeAllocation' })
Object.defineProperty(TimeAllocation_, 'name', { value: 'trix.core.TimeAllocation' })

export function _UserAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class User extends Base {
        userID?: string;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        isManager?: boolean | null;
    /**
    * Type for an association to Countries
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-country
    */
        country?: _.Country | null;
        country_code?: string | null;
        substitute?: __.Association.to<User> | null;
        substitute_userID?: string | null;
        team?: __.Association.to<Team> | null;
        team_ID?: string | null;
        manager?: __.Association.to<User> | null;
        manager_userID?: string | null;
        allocations?: __.Association.to.many<User2Allocation_>;
      static actions: {
    }
  };
}
export class User extends _._managedAspect(_UserAspect(__.Entity)) {}
export class User_ extends Array<User> {}
Object.defineProperty(User, 'name', { value: 'trix.core.User' })
Object.defineProperty(User_, 'name', { value: 'trix.core.User' })

export function _User2AllocationAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class User2Allocation extends Base {
        userID?: string;
        allocationID?: string;
        isDefault?: boolean | null;
        favorite?: boolean | null;
        allocation?: __.Association.to<TimeAllocation> | null;
        allocation_ID?: string | null;
        user?: __.Association.to<User> | null;
        user_userID?: string | null;
      static actions: {
    }
  };
}
export class User2Allocation extends _._managedAspect(_._temporalAspect(_User2AllocationAspect(__.Entity))) {}
export class User2Allocation_ extends Array<User2Allocation> {}
Object.defineProperty(User2Allocation, 'name', { value: 'trix.core.User2Allocation' })
Object.defineProperty(User2Allocation_, 'name', { value: 'trix.core.User2Allocation' })

export function _TimeRegistrationAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class TimeRegistration extends Base {
        startDate?: string | null;
        endDate?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        wholeDay?: boolean | null;
        amount?: number | null;
        registrationStatus?: RegistrationStatus | null;
        registrationType?: RegistrationType | null;
        comment?: string | null;
        invalid?: boolean | null;
        statusContext?: string | null;
        recordStatus?: RecordStatus | null;
        user?: __.Association.to<User> | null;
        user_userID?: string | null;
        allocation?: __.Association.to<TimeAllocation> | null;
        allocation_ID?: string | null;
      static actions: {
    }
  };
}
export class TimeRegistration extends _._cuidAspect(_._managedAspect(_TimeRegistrationAspect(__.Entity))) {}
export class TimeRegistration_ extends Array<TimeRegistration> {}
Object.defineProperty(TimeRegistration, 'name', { value: 'trix.core.TimeRegistration' })
Object.defineProperty(TimeRegistration_, 'name', { value: 'trix.core.TimeRegistration' })

export function _WorkScheduleAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class WorkSchedule extends Base {
        scheduleOrder?: number | null;
        week?: __.Association.to<WorkWeek> | null;
        week_ID?: string | null;
        user?: __.Association.to<User> | null;
        user_userID?: string | null;
      static actions: {
    }
  };
}
export class WorkSchedule extends _._cuidAspect(_._managedAspect(_WorkScheduleAspect(__.Entity))) {}
export class WorkSchedule_ extends Array<WorkSchedule> {}
Object.defineProperty(WorkSchedule, 'name', { value: 'trix.core.WorkSchedule' })
Object.defineProperty(WorkSchedule_, 'name', { value: 'trix.core.WorkSchedule' })

export function _WorkWeekAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class WorkWeek extends Base {
        name?: string | null;
        monday?: __.Association.to<WorkDay> | null;
        monday_ID?: string | null;
        tuesday?: __.Association.to<WorkDay> | null;
        tuesday_ID?: string | null;
        wednesday?: __.Association.to<WorkDay> | null;
        wednesday_ID?: string | null;
        thursday?: __.Association.to<WorkDay> | null;
        thursday_ID?: string | null;
        friday?: __.Association.to<WorkDay> | null;
        friday_ID?: string | null;
        saturday?: __.Association.to<WorkDay> | null;
        saturday_ID?: string | null;
        sunday?: __.Association.to<WorkDay> | null;
        sunday_ID?: string | null;
      static actions: {
    }
  };
}
export class WorkWeek extends _._cuidAspect(_._managedAspect(_WorkWeekAspect(__.Entity))) {}
export class WorkWeek_ extends Array<WorkWeek> {}
Object.defineProperty(WorkWeek, 'name', { value: 'trix.core.WorkWeek' })
Object.defineProperty(WorkWeek_, 'name', { value: 'trix.core.WorkWeek' })

export function _WorkDayAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class WorkDay extends Base {
        name?: string | null;
        crossingMidnight?: boolean | null;
        startTime?: string | null;
        endTime?: string | null;
      static actions: {
    }
  };
}
export class WorkDay extends _._cuidAspect(_._managedAspect(_WorkDayAspect(__.Entity))) {}
export class WorkDay_ extends Array<WorkDay> {}
Object.defineProperty(WorkDay, 'name', { value: 'trix.core.WorkDay' })
Object.defineProperty(WorkDay_, 'name', { value: 'trix.core.WorkDay' })

export function _TeamAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Team extends Base {
        externalCode?: string | null;
        manager?: __.Association.to<User> | null;
        manager_userID?: string | null;
        members?: __.Association.to.many<User_>;
      static actions: {
    }
  };
}
export class Team extends _._cuidAspect(_sap_common._CodeListAspect(_TeamAspect(__.Entity))) {}
export class Team_ extends Array<Team> {}
Object.defineProperty(Team, 'name', { value: 'trix.core.Team' })
Object.defineProperty(Team_, 'name', { value: 'trix.core.Team' })

export function _WeeklyRecordingAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class WeeklyRecording extends Base {
        user?: __.Association.to<User>;
        user_userID?: string;
        record?: string;
        weekNumber?: number | null;
        year?: number | null;
        workHours?: number | null;
        absenceHours?: number | null;
        weekStart?: string | null;
        weekEnd?: string | null;
      static actions: {
    }
  };
}
export class WeeklyRecording extends _._managedAspect(_WeeklyRecordingAspect(__.Entity)) {}
export class WeeklyRecording_ extends Array<WeeklyRecording> {}
Object.defineProperty(WeeklyRecording, 'name', { value: 'trix.core.WeeklyRecording' })
Object.defineProperty(WeeklyRecording_, 'name', { value: 'trix.core.WeeklyRecording' })

/**
* EVENT CONTEXT TYPES
*/
export function _TimeRegistrationEventContextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class TimeRegistrationEventContext extends Base {
        id?: string | null;
        startDate?: string | null;
        endDate?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        wholeDay?: boolean | null;
        amount?: number | null;
        registrationStatus?: RegistrationStatus | null;
        registrationType?: RegistrationType | null;
        comment?: string | null;
        invalid?: boolean | null;
        statusContext?: string | null;
        recordStatus?: RecordStatus | null;
      static actions: {
    }
  };
}
export class TimeRegistrationEventContext extends _TimeRegistrationEventContextAspect(__.Entity) {}
export class TimeRegistrationEventContext_ extends Array<TimeRegistrationEventContext> {}
Object.defineProperty(TimeRegistrationEventContext, 'name', { value: 'trix.core.TimeRegistrationEventContext' })
Object.defineProperty(TimeRegistrationEventContext_, 'name', { value: 'trix.core.TimeRegistrationEventContext' })

export function _UserEventContextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class UserEventContext extends Base {
        userID?: string | null;
        email?: string | null;
      static actions: {
    }
  };
}
export class UserEventContext extends _UserEventContextAspect(__.Entity) {}
export class UserEventContext_ extends Array<UserEventContext> {}
Object.defineProperty(UserEventContext, 'name', { value: 'trix.core.UserEventContext' })
Object.defineProperty(UserEventContext_, 'name', { value: 'trix.core.UserEventContext' })

export function _AllocationEventContextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class AllocationEventContext extends Base {
        id?: string | null;
        isAbsence?: boolean | null;
        validFrom?: string | null;
        validTo?: string | null;
      static actions: {
    }
  };
}
export class AllocationEventContext extends _AllocationEventContextAspect(__.Entity) {}
export class AllocationEventContext_ extends Array<AllocationEventContext> {}
Object.defineProperty(AllocationEventContext, 'name', { value: 'trix.core.AllocationEventContext' })
Object.defineProperty(AllocationEventContext_, 'name', { value: 'trix.core.AllocationEventContext' })
