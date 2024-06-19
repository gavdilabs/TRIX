export namespace trix.core {
  export enum RecordStatus {
    Awaiting,
    Processing = 1,
    Complete = 2,
    Error = 3,
  }

  export enum RegistrationStatus {
    InProcess = 1,
    Complete = 2,
    Approved = 3,
    Rejected = 4,
  }

  export enum RegistrationType {
    Manual,
    ClockInOut = 1,
  }

  export enum AllocationType {
    Project = "Project",
    Service = "Service",
    AbsenceAttendance = "AbsenceAttendance",
  }

  export interface IEnumPair {
    name: string;
    index: number;
  }

  export interface ITimeAllocation {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    validFrom: Date;
    validTo: Date;
    description: string;
    isAbsence: boolean;
    allocationType: AllocationType;
    allocatedUsers?: IUser2Allocation[];
  }

  export interface IUser {
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    userID: string;
    firstName: string;
    lastName: string;
    email: string;
    isManager: boolean;
    team?: ITeam;
    team_ID?: string;
    manager?: IUser;
    manager_userID?: string;
    allocations?: IUser2Allocation[];
  }

  export interface IUser2Allocation {
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    validFrom: Date;
    validTo: Date;
    userID: string;
    allocationID: string;
    default: boolean;
    favorite: boolean;
    allocation?: ITimeAllocation;
    user?: IUser;
  }

  export interface ITimeRegistration {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    wholeDay: boolean;
    amount: number;
    registrationStatus: RegistrationStatus;
    registrationType: RegistrationType;
    comment: string;
    invalid: boolean;
    statusContext: string;
    recordStatus: RecordStatus;
    user?: IUser;
    user_userID?: string;
    allocation?: ITimeAllocation;
    allocation_ID?: string;
  }

  export interface IWorkSchedule {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    order: number;
    week?: IWorkWeek;
    week_ID?: string;
    user?: IUser;
    user_userID?: string;
  }

  export interface IWorkWeek {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    name: string;
    monday?: IWorkDay;
    monday_ID?: string;
    tuesday?: IWorkDay;
    tuesday_ID?: string;
    wednesday?: IWorkDay;
    wednesday_ID?: string;
    thursday?: IWorkDay;
    thursday_ID?: string;
    friday?: IWorkDay;
    friday_ID?: string;
    saturday?: IWorkDay;
    saturday_ID?: string;
    sunday?: IWorkDay;
    sunday_ID?: string;
  }

  export interface IWorkDay {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    name: string;
    crossingMidnight: boolean;
    startTime: Date;
    endTime: Date;
  }

  export interface ITeam {
    ID: string;
    name: string;
    descr: string;
    externalCode: string;
    manager?: IUser;
    manager_userID?: string;
    members?: IUser[];
    texts: ITexts[];
    localized?: ITexts;
  }

  export interface ITimeRegistrationEventContext {
    id: string;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    wholeDay: boolean;
    amount: number;
    registrationStatus: RegistrationStatus;
    registrationType: RegistrationType;
    comment: string;
    invalid: boolean;
    statusContext: string;
    recordStatus: RecordStatus;
  }

  export interface IUserEventContext {
    userID: string;
    email: string;
  }

  export interface IAllocationEventContext {
    id: string;
    isAbsence: boolean;
    validFrom: Date;
    validTo: Date;
  }

  export interface ITexts {
    locale: string;
    ID: string;
    name: string;
    descr: string;
  }

  export enum Entity {
    EnumPair = "trix.core.EnumPair",
    TimeAllocation = "trix.core.TimeAllocation",
    User = "trix.core.User",
    User2Allocation = "trix.core.User2Allocation",
    TimeRegistration = "trix.core.TimeRegistration",
    WorkSchedule = "trix.core.WorkSchedule",
    WorkWeek = "trix.core.WorkWeek",
    WorkDay = "trix.core.WorkDay",
    Team = "trix.core.Team",
    TimeRegistrationEventContext = "trix.core.TimeRegistrationEventContext",
    UserEventContext = "trix.core.UserEventContext",
    AllocationEventContext = "trix.core.AllocationEventContext",
    Texts = "trix.core.Team.texts",
  }

  export enum SanitizedEntity {
    EnumPair = "EnumPair",
    TimeAllocation = "TimeAllocation",
    User = "User",
    User2Allocation = "User2Allocation",
    TimeRegistration = "TimeRegistration",
    WorkSchedule = "WorkSchedule",
    WorkWeek = "WorkWeek",
    WorkDay = "WorkDay",
    Team = "Team",
    TimeRegistrationEventContext = "TimeRegistrationEventContext",
    UserEventContext = "UserEventContext",
    AllocationEventContext = "AllocationEventContext",
    Texts = "Texts",
  }
}

export namespace sap.common {
  export interface ILanguages {
    name: string;
    descr: string;
    code: string;
    texts: ITexts[];
    localized?: ITexts;
  }

  export interface ICountries {
    name: string;
    descr: string;
    code: string;
    texts: ITexts[];
    localized?: ITexts;
  }

  export interface ICurrencies {
    name: string;
    descr: string;
    code: string;
    symbol: string;
    texts: ITexts[];
    localized?: ITexts;
  }

  export interface ITexts {
    locale: string;
    name: string;
    descr: string;
    code: string;
  }

  export interface ITexts {
    locale: string;
    name: string;
    descr: string;
    code: string;
  }

  export interface ITexts {
    locale: string;
    name: string;
    descr: string;
    code: string;
  }

  export enum Entity {
    Languages = "sap.common.Languages",
    Countries = "sap.common.Countries",
    Currencies = "sap.common.Currencies",
    Texts = "sap.common.Currencies.texts",
  }

  export enum SanitizedEntity {
    Languages = "Languages",
    Countries = "Countries",
    Currencies = "Currencies",
    Texts = "Texts",
  }
}

export namespace TrixCoreService {
  export interface IUserSet {
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    userID: string;
    firstName: string;
    lastName: string;
    email: string;
    isManager: boolean;
    team?: ITeamSet;
    team_ID?: string;
    manager?: IUserSet;
    manager_userID?: string;
    allocations?: IUser2AllocationSet[];
  }

  export interface IManagerSet {
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    userID: string;
    firstName: string;
    lastName: string;
    email: string;
    isManager: boolean;
    team?: ITeamSet;
    team_ID?: string;
    manager?: IUserSet;
    manager_userID?: string;
    allocations?: IUser2AllocationSet[];
  }

  export namespace IManagerSet.actions {
    export enum FuncGetTeam {
      name = "getTeam",
    }

    export type FuncGetTeamReturn = TrixCoreService.ITeamSet;

    export enum FuncGetReports {
      name = "getReports",
    }

    export type FuncGetReportsReturn = TrixCoreService.IUserSet[];
  }

  export interface ITimeAllocationSet {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    validFrom: Date;
    validTo: Date;
    description: string;
    isAbsence: boolean;
    allocationType: trix.core.AllocationType;
    allocatedUsers?: IUser2AllocationSet[];
  }

  export interface IUser2AllocationSet {
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    validFrom: Date;
    validTo: Date;
    userID: string;
    allocationID: string;
    default: boolean;
    favorite: boolean;
    allocation?: ITimeAllocationSet;
    user?: IUserSet;
  }

  export interface ITimeRegistrationSet {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    wholeDay: boolean;
    amount: number;
    registrationStatus: trix.core.RegistrationStatus;
    registrationType: trix.core.RegistrationType;
    comment: string;
    invalid: boolean;
    statusContext: string;
    recordStatus: trix.core.RecordStatus;
    user?: IUserSet;
    user_userID?: string;
    allocation?: ITimeAllocationSet;
    allocation_ID?: string;
  }

  export namespace ITimeRegistrationSet.actions {
    export enum ActionClockIn {
      name = "clockIn",
    }

    export type ActionClockInReturn = string;

    export enum ActionClockOut {
      name = "clockOut",
    }

    export type ActionClockOutReturn = string;

    export enum FuncElapsedTime {
      name = "elapsedTime",
    }

    export type FuncElapsedTimeReturn = Date;

    export enum ActionValidate {
      name = "validate",
    }

    export type ActionValidateReturn = boolean;
  }

  export interface IWorkScheduleSet {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    order: number;
    week?: IWorkWeekSet;
    week_ID?: string;
    user?: IUserSet;
    user_userID?: string;
  }

  export interface IWorkWeekSet {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    name: string;
    monday?: IWorkDaySet;
    monday_ID?: string;
    tuesday?: IWorkDaySet;
    tuesday_ID?: string;
    wednesday?: IWorkDaySet;
    wednesday_ID?: string;
    thursday?: IWorkDaySet;
    thursday_ID?: string;
    friday?: IWorkDaySet;
    friday_ID?: string;
    saturday?: IWorkDaySet;
    saturday_ID?: string;
    sunday?: IWorkDaySet;
    sunday_ID?: string;
  }

  export interface IWorkDaySet {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    name: string;
    crossingMidnight: boolean;
    startTime: Date;
    endTime: Date;
  }

  export interface ITeamSet {
    ID: string;
    name: string;
    descr: string;
    externalCode: string;
    manager?: IUserSet;
    manager_userID?: string;
    members?: IUserSet[];
    texts: ITexts[];
    localized?: ITexts;
  }

  export namespace ITeamSet.actions {
    export enum FuncGetTeamSize {
      name = "getTeamSize",
    }

    export type FuncGetTeamSizeReturn = number;
  }

  export interface ITexts {
    locale: string;
    ID: string;
    name: string;
    descr: string;
  }

  export enum FuncGetRecordStatuses {
    name = "getRecordStatuses",
  }

  export type FuncGetRecordStatusesReturn = trix.core.IEnumPair[];

  export enum FuncGetRegistrationStatuses {
    name = "getRegistrationStatuses",
  }

  export type FuncGetRegistrationStatusesReturn = trix.core.IEnumPair[];

  export enum FuncGetRegistrationTypes {
    name = "getRegistrationTypes",
  }

  export type FuncGetRegistrationTypesReturn = trix.core.IEnumPair[];

  export enum FuncGetAllocationTypes {
    name = "getAllocationTypes",
  }

  export type FuncGetAllocationTypesReturn = trix.core.AllocationType[];

  export enum Entity {
    UserSet = "TrixCoreService.UserSet",
    ManagerSet = "TrixCoreService.ManagerSet",
    TimeAllocationSet = "TrixCoreService.TimeAllocationSet",
    User2AllocationSet = "TrixCoreService.User2AllocationSet",
    TimeRegistrationSet = "TrixCoreService.TimeRegistrationSet",
    WorkScheduleSet = "TrixCoreService.WorkScheduleSet",
    WorkWeekSet = "TrixCoreService.WorkWeekSet",
    WorkDaySet = "TrixCoreService.WorkDaySet",
    TeamSet = "TrixCoreService.TeamSet",
    Texts = "TrixCoreService.TeamSet.texts",
  }

  export enum SanitizedEntity {
    UserSet = "UserSet",
    ManagerSet = "ManagerSet",
    TimeAllocationSet = "TimeAllocationSet",
    User2AllocationSet = "User2AllocationSet",
    TimeRegistrationSet = "TimeRegistrationSet",
    WorkScheduleSet = "WorkScheduleSet",
    WorkWeekSet = "WorkWeekSet",
    WorkDaySet = "WorkDaySet",
    TeamSet = "TeamSet",
    Texts = "Texts",
  }
}

export type User = string;

export enum Entity {}

export enum SanitizedEntity {}
