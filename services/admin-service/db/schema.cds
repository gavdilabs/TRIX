using {
  managed,
  sap,
  cuid
} from '@sap/cds/common';

namespace trix.admin;

@assert.range
type SolutionType : Integer enum {
  Standalone          = 0;
  S4                  = 1;
  ECC                 = 2;
  SuccessFactors      = 3;
}

@assert.range
type ApprovalType : Integer enum {
  Manual              = 0;
  BackgroundJob       = 1;
  Auto                = 3;
  ExternalIntegration = 4;
}

entity SolutionConfiguration : cuid, managed {
  companyName  : String(255);
  solutionType : SolutionType;
  approvalType : ApprovalType;
}
