using {
  temporal,
  managed,
  Country,
  sap,
  cuid
} from '@sap/cds/common';
using {trix.admin as admin} from '../../admin-service/db/schema';

namespace trix.core;

@assert.range
type RecordStatus       : Integer enum {
  Awaiting   = 0;
  Processing = 1;
  Complete   = 2;
  Error      = 3;
}

@assert.range
type RegistrationStatus : Integer enum {
  InProcess  = 1; // 10
  Complete   = 2; // 20
  Approved   = 3; // 30
  Rejected   = 4; // 40
}

@assert.range
type RegistrationType   : Integer enum {
  Manual     = 0;
  ClockInOut = 1;
}

entity TimeAllocationGroup : cuid, managed, temporal {
  title           : String(100);
  description     : String(1000);
  hex             : String(25);
  icon            : String(200);
  order           : Integer;
  timeAllocations : Association to many TimeAllocation
                      on timeAllocations.allocationGroupId = ID;
}

// aka. Project or Worklist
entity TimeAllocation : cuid, managed, temporal {
  description       : String(1000);
  isAbsence         : Boolean;
  allocationGroupId : String;
  allocationGroup   : Association to TimeAllocationGroup
                        on allocationGroup.ID = allocationGroupId;
  allocatedUsers    : Association to many User2Allocation
                        on allocatedUsers.allocationID = ID;
}

entity User : managed {
  key userID      : String(255);
      firstName   : String(255);
      lastName    : String(255);
      email       : String(255);
      isManager   : Boolean;
      substitute  : Association to User null;
      country     : Country;
      team        : Association to Team;
      manager     : Association to User;
      allocations : Association to many User2Allocation
                      on allocations.userID = userID;
}

entity User2Allocation : managed, temporal {
  key userID       : String(255);
  key allocationID : String(255);
      isDefault    : Boolean;
      favorite     : Boolean;
      allocation   : Association to TimeAllocation
                       on allocation.ID = allocationID;
      user         : Association to User
                       on user.userID = userID;
}

entity TimeRegistration : cuid, managed {
  startDate          : Date;
  endDate            : Date null;
  startTime          : Time;
  endTime            : Time;
  wholeDay           : Boolean;
  amount             : Decimal(3, 1);
  registrationStatus : RegistrationStatus;
  registrationType   : RegistrationType;
  comment            : String(255);
  invalid            : Boolean;
  statusContext      : String(255) null;
  recordStatus       : RecordStatus;
  user               : Association to User;
  allocation         : Association to TimeAllocation;
}

entity WorkSchedule : cuid, managed {
  scheduleOrder : Integer; // Week number in some cases
  week          : Association to WorkWeek;
  user          : Association to User;
}

entity WorkWeek : cuid, managed {
  name      : String(255);
  monday    : Association to WorkDay;
  tuesday   : Association to WorkDay;
  wednesday : Association to WorkDay;
  thursday  : Association to WorkDay;
  friday    : Association to WorkDay;
  saturday  : Association to WorkDay;
  sunday    : Association to WorkDay;
}

entity WorkDay : cuid, managed {
  name             : String(255);
  crossingMidnight : Boolean; // Cinderella rule
  startTime        : Time;
  endTime          : Time;
}

entity Team : cuid, sap.common.CodeList {
  externalCode : String(255) null;
  manager      : Association to User;
  members      : Association to many User
                   on members.team = $self;
}

entity WeeklyRecording : managed {
  key user         : Association to User;
  key record       : String(255); // YYYY-WeekNumber
      weekNumber   : Integer;
      year         : Integer;
      workHours    : Double;
      absenceHours : Double;
      weekStart    : Date;
      weekEnd      : Date;
}

/*** EVENT CONTEXT TYPES ***/

type TimeRegistrationEventContext {
  id                 : String;
  startDate          : Date;
  endDate            : Date null;
  startTime          : Time;
  endTime            : Time;
  wholeDay           : Boolean;
  amount             : Decimal(2, 1);
  registrationStatus : RegistrationStatus;
  registrationType   : RegistrationType;
  comment            : String(255);
  invalid            : Boolean;
  statusContext      : String(255) null;
  recordStatus       : RecordStatus;
}

type UserEventContext {
  userID : String(255);
  email  : String(255);
}

type AllocationEventContext {
  id        : String;
  isAbsence : Boolean;
  validFrom : DateTime;
  validTo   : DateTime;
}

context trix.admin {
  view SolutionConfiguration as select from admin.Configuration;
  view ValidationRules as select from admin.ValidationRule;
}
