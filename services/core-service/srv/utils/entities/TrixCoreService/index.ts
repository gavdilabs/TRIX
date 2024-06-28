// This is an automatically generated file. Please do not change its contents manually!
import * as _trix_core from './../trix/core';
import * as __ from './../_';
import * as _ from './..';
import * as _sap_common from './../sap/common';
import * as _trix_common_types from './../trix/common/types';
export default { name: 'TrixCoreService' }
export function _UserSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class UserSet extends Base {
        userID?: string;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        isManager?: boolean | null;
        substitute?: __.Association.to<_trix_core.User> | null;
        substitute_userID?: string | null;
    /**
    * Type for an association to Countries
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-country
    */
        country?: _.Country | null;
        country_code?: string | null;
        team?: __.Association.to<_trix_core.Team> | null;
        team_ID?: string | null;
        manager?: __.Association.to<_trix_core.User> | null;
        manager_userID?: string | null;
        allocations?: __.Association.to.many<_trix_core.User2Allocation_>;
      static actions: {
    }
  };
}
export class UserSet extends _._managedAspect(_UserSetAspect(__.Entity)) {}
export class UserSet_ extends Array<UserSet> {}
Object.defineProperty(UserSet, 'name', { value: 'TrixCoreService.UserSet' })
Object.defineProperty(UserSet_, 'name', { value: 'TrixCoreService.UserSet' })

export function _ManagerSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class ManagerSet extends Base {
        userID?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        isManager?: boolean | null;
        substitute?: __.Association.to<_trix_core.User> | null;
        substitute_userID?: string | null;
    /**
    * Type for an association to Countries
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-country
    */
        country?: _.Country | null;
        country_code?: string | null;
        team?: __.Association.to<_trix_core.Team> | null;
        team_ID?: string | null;
        manager?: __.Association.to<_trix_core.User> | null;
        manager_userID?: string | null;
        allocations?: __.Association.to.many<_trix_core.User2Allocation_>;
      static actions: {
    }
  };
}
export class ManagerSet extends _._managedAspect(_ManagerSetAspect(__.Entity)) {}
export class ManagerSet_ extends Array<ManagerSet> {}
Object.defineProperty(ManagerSet, 'name', { value: 'TrixCoreService.ManagerSet' })
Object.defineProperty(ManagerSet_, 'name', { value: 'TrixCoreService.ManagerSet' })

export function _TimeAllocationSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class TimeAllocationSet extends Base {
        description?: string | null;
        isAbsence?: boolean | null;
        allocationType?: _trix_core.AllocationType | null;
        allocatedUsers?: __.Association.to.many<_trix_core.User2Allocation_>;
      static actions: {
    }
  };
}
export class TimeAllocationSet extends _._cuidAspect(_._managedAspect(_._temporalAspect(_TimeAllocationSetAspect(__.Entity)))) {}
export class TimeAllocationSet_ extends Array<TimeAllocationSet> {}
Object.defineProperty(TimeAllocationSet, 'name', { value: 'TrixCoreService.TimeAllocationSet' })
Object.defineProperty(TimeAllocationSet_, 'name', { value: 'TrixCoreService.TimeAllocationSet' })

export function _User2AllocationSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class User2AllocationSet extends Base {
        userID?: string;
        allocationID?: string;
        isDefault?: boolean | null;
        favorite?: boolean | null;
        allocation?: __.Association.to<_trix_core.TimeAllocation> | null;
        allocation_ID?: string | null;
        user?: __.Association.to<_trix_core.User> | null;
        user_userID?: string | null;
      static actions: {
    }
  };
}
export class User2AllocationSet extends _._managedAspect(_._temporalAspect(_User2AllocationSetAspect(__.Entity))) {}
export class User2AllocationSet_ extends Array<User2AllocationSet> {}
Object.defineProperty(User2AllocationSet, 'name', { value: 'TrixCoreService.User2AllocationSet' })
Object.defineProperty(User2AllocationSet_, 'name', { value: 'TrixCoreService.User2AllocationSet' })

export function _TimeRegistrationSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class TimeRegistrationSet extends Base {
        startDate?: string | null;
        endDate?: string | null;
        startTime?: string | null;
        endTime?: string | null;
        wholeDay?: boolean | null;
        amount?: number | null;
        registrationStatus?: _trix_core.RegistrationStatus | null;
        registrationType?: _trix_core.RegistrationType | null;
        comment?: string | null;
        invalid?: boolean | null;
        statusContext?: string | null;
        recordStatus?: _trix_core.RecordStatus | null;
        user?: __.Association.to<_trix_core.User> | null;
        user_userID?: string | null;
        allocation?: __.Association.to<_trix_core.TimeAllocation> | null;
        allocation_ID?: string | null;
      static actions: {
        elapsedTime: { (): string, __parameters: {}, __returns: string }
        validate: { (): boolean, __parameters: {}, __returns: boolean }
    }
  };
}
export class TimeRegistrationSet extends _._cuidAspect(_._managedAspect(_TimeRegistrationSetAspect(__.Entity))) {}
export class TimeRegistrationSet_ extends Array<TimeRegistrationSet> {}
Object.defineProperty(TimeRegistrationSet, 'name', { value: 'TrixCoreService.TimeRegistrationSet' })
Object.defineProperty(TimeRegistrationSet_, 'name', { value: 'TrixCoreService.TimeRegistrationSet' })

export function _WorkScheduleSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class WorkScheduleSet extends Base {
        scheduleOrder?: number | null;
        week?: __.Association.to<_trix_core.WorkWeek> | null;
        week_ID?: string | null;
        user?: __.Association.to<_trix_core.User> | null;
        user_userID?: string | null;
      static actions: {
    }
  };
}
export class WorkScheduleSet extends _._cuidAspect(_._managedAspect(_WorkScheduleSetAspect(__.Entity))) {}
export class WorkScheduleSet_ extends Array<WorkScheduleSet> {}
Object.defineProperty(WorkScheduleSet, 'name', { value: 'TrixCoreService.WorkScheduleSet' })
Object.defineProperty(WorkScheduleSet_, 'name', { value: 'TrixCoreService.WorkScheduleSet' })

export function _WorkWeekSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class WorkWeekSet extends Base {
        name?: string | null;
        monday?: __.Association.to<_trix_core.WorkDay> | null;
        monday_ID?: string | null;
        tuesday?: __.Association.to<_trix_core.WorkDay> | null;
        tuesday_ID?: string | null;
        wednesday?: __.Association.to<_trix_core.WorkDay> | null;
        wednesday_ID?: string | null;
        thursday?: __.Association.to<_trix_core.WorkDay> | null;
        thursday_ID?: string | null;
        friday?: __.Association.to<_trix_core.WorkDay> | null;
        friday_ID?: string | null;
        saturday?: __.Association.to<_trix_core.WorkDay> | null;
        saturday_ID?: string | null;
        sunday?: __.Association.to<_trix_core.WorkDay> | null;
        sunday_ID?: string | null;
      static actions: {
    }
  };
}
export class WorkWeekSet extends _._cuidAspect(_._managedAspect(_WorkWeekSetAspect(__.Entity))) {}
export class WorkWeekSet_ extends Array<WorkWeekSet> {}
Object.defineProperty(WorkWeekSet, 'name', { value: 'TrixCoreService.WorkWeekSet' })
Object.defineProperty(WorkWeekSet_, 'name', { value: 'TrixCoreService.WorkWeekSet' })

export function _WorkDaySetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class WorkDaySet extends Base {
        name?: string | null;
        crossingMidnight?: boolean | null;
        startTime?: string | null;
        endTime?: string | null;
      static actions: {
    }
  };
}
export class WorkDaySet extends _._cuidAspect(_._managedAspect(_WorkDaySetAspect(__.Entity))) {}
export class WorkDaySet_ extends Array<WorkDaySet> {}
Object.defineProperty(WorkDaySet, 'name', { value: 'TrixCoreService.WorkDaySet' })
Object.defineProperty(WorkDaySet_, 'name', { value: 'TrixCoreService.WorkDaySet' })

export function _TeamSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class TeamSet extends Base {
        externalCode?: string | null;
        manager?: __.Association.to<_trix_core.User> | null;
        manager_userID?: string | null;
        members?: __.Association.to.many<_trix_core.User_>;
      static actions: {
        getTeamSize: { (): number, __parameters: {}, __returns: number }
    }
  };
}
export class TeamSet extends _._cuidAspect(_sap_common._CodeListAspect(_TeamSetAspect(__.Entity))) {}
export class TeamSet_ extends Array<TeamSet> {}
Object.defineProperty(TeamSet, 'name', { value: 'TrixCoreService.TeamSet' })
Object.defineProperty(TeamSet_, 'name', { value: 'TrixCoreService.TeamSet' })

/**
* Code list for countries
* 
* See https://cap.cloud.sap/docs/cds/common#entity-countries
*/
export function _CountryAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Country extends Base {
        code?: string | null;
      static actions: {
    }
  };
}
export class Country extends _sap_common._CodeListAspect(_CountryAspect(__.Entity)) {}
export class Countries extends Array<Country> {}
Object.defineProperty(Country, 'name', { value: 'sap.common.Countries' })
Object.defineProperty(Countries, 'name', { value: 'sap.common.Countries' })

// event
export class timeRegistrationCreated {
  /**
  * EVENT CONTEXT TYPES
  */
    registration: _trix_core.TimeRegistrationEventContext | null;
    user: _trix_core.UserEventContext | null;
}
// event
export class timeRegistrationUpdated {
  /**
  * EVENT CONTEXT TYPES
  */
    registration: _trix_core.TimeRegistrationEventContext | null;
    user: _trix_core.UserEventContext | null;
}
// event
export class timeRegistrationDeleted {
  /**
  * EVENT CONTEXT TYPES
  */
    registration: _trix_core.TimeRegistrationEventContext | null;
    user: _trix_core.UserEventContext | null;
}
// event
export class allocationCreated {
    allocation: _trix_core.AllocationEventContext | null;
}
// event
export class allocationUpdated {
    allocation: _trix_core.AllocationEventContext | null;
}
// event
export class allocationDeleted {
    allocation: _trix_core.AllocationEventContext | null;
}
// action
export declare const getRecordStatuses: { (): Array<_trix_common_types.EnumPair>, __parameters: {}, __returns: Array<_trix_common_types.EnumPair> };
// action
export declare const getRegistrationStatuses: { (): Array<_trix_common_types.EnumPair>, __parameters: {}, __returns: Array<_trix_common_types.EnumPair> };
// action
export declare const getRegistrationTypes: { (): Array<_trix_common_types.EnumPair>, __parameters: {}, __returns: Array<_trix_common_types.EnumPair> };
// action
export declare const getAllocationTypes: { (): Array<_trix_core.AllocationType>, __parameters: {}, __returns: Array<_trix_core.AllocationType> };
// action
export declare const getActiveUser: { (): UserSet | null, __parameters: {}, __returns: UserSet | null };