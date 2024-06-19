using {
  managed,
  sap,
  cuid
} from '@sap/cds/common';

namespace trix.admin;

@assert.range
type SolutionType      : Integer enum {
  Standalone          = 0;
  S4                  = 1;
  ECC                 = 2;
  SuccessFactors      = 3;
}

@assert.range
type ApprovalType      : Integer enum {
  Manual              = 0;
  BackgroundJob       = 1;
  Auto                = 3;
  ExternalIntegration = 4;
}

@assert.range
type ValidationType    : Integer enum {
  None                = 0;
  ElevenHourRule      = 1;
  FourtyEightHourRule = 2;
  AbsenceInWorkHours  = 3;
}

@assert.range
type ConfigurationType : Integer enum {
  Global              = 0;
}

@assert.range
type RegistrationGroup : Integer enum {
  Project             = 0;
  Service             = 1;
  AbsenceAttendance   = 2;
  Custom              = 3;
}

entity ValidationRule : managed {
  key rule    : ValidationType;
      enabled : Boolean;
}

entity RegistrationTypes : cuid, managed {
  // NOTE: This needs to be fleshed out further
  group : RegistrationGroup;
}

entity Configuration : cuid, managed {
  companyName       : String(255);
  configurationType : ConfigurationType;
  solutionType      : SolutionType;
  approvalEnabled   : Boolean;
  approvalType      : ApprovalType;
  validationRules   : Association to many ValidationRule;
  registrationTypes : Association to many RegistrationTypes;
}
