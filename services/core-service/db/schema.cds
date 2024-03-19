using {
  temporal,
  managed,
  sap,
  cuid
} from '@sap/cds/common';

namespace trix.core;

@assert.range
type RecordStatus       : Integer enum {
  Awaiting          = 0;
  Processing        = 1;
  Complete          = 2;
  Error             = 3;
}

@assert.range
type RegistrationStatus : Integer enum {
  InProcess         = 1; // 10
  Complete          = 2; // 20
  Approved          = 3; // 30
  Rejected          = 4; // 40
}

@assert.range
type RegistrationType   : Integer enum {
  Manual            = 0;
  ClockInOut        = 1;
}

@assert.range
type AllocationType     : String enum {
  Project           = 'Project';
  Service           = 'Service';
  AbsenceAttendance = 'AbsenceAttendance';
}

// aka. Project or Worklist
entity TimeAllocation : cuid, managed, temporal {
  description    : String(1000);
  allocationType : AllocationType;
  allocatedUsers : Association to many User2Allocation
                     on allocatedUsers.allocationID = ID;
}

entity User : managed {
  key userID      : String(255);
      firstName   : String(255);
      lastName    : String(255);
      email       : String(255);
      isManager   : Boolean;
      team        : Association to Team;
      manager     : Association to User;
      allocations : Association to many User2Allocation
                      on allocations.userID = userID;
}

entity User2Allocation : managed, temporal {
  key userID       : String(255);
  key allocationID : String(255);
      default      : Boolean;
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
  amount             : Decimal(1, 2);
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
  order : Integer; // Week number in some cases
  week  : Association to WorkWeek;
  user  : Association to User;
}

entity WorkWeek : cuid, managed {
  monday    : Association to WorkDay;
  tuesday   : Association to WorkDay;
  wednesday : Association to WorkDay;
  thursday  : Association to WorkDay;
  friday    : Association to WorkDay;
  saturday  : Association to WorkDay;
  sunday    : Association to WorkDay;
}

entity WorkDay : cuid, managed {
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
