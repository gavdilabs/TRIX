using {
  managed,
  cuid
} from '@sap/cds/common';

namespace trix.admin;

// NOTE: This is for future planned integrations
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

entity ValidationRule : managed {
  key rule    : ValidationType;
      enabled : Boolean;
}

entity RegistrationGroup : cuid, managed {
  name: String(255);
  description: String(255);
}

entity RegistrationType : cuid, managed {
  // NOTE: This needs to be fleshed out further
  name: String(255);
  description: String(255);
  group : Association to one RegistrationGroup;
}

entity Configuration : cuid, managed {
  companyName       : String(255);
  configurationType : ConfigurationType;
  approvalEnabled   : Boolean;
  approvalType      : ApprovalType;
  validationRules   : Association to many ValidationRule;
  registrationTypes : Association to many RegistrationType;
}
