import { CDSDispatcher } from "@dxfrontier/cds-ts-dispatcher";
import ValidationTypesHandler from "./controller/functions/getValidationTypes";
import ApprovalTypesHandler from "./controller/functions/getApprovalTypes";
import ConfigurationTypesHandler from "./controller/functions/getConfigurationTypes";
import RegistrationGroupsHandler from "./controller/functions/getRegistrationGroups";

export = new CDSDispatcher([
  // Entities
  // Functions
  ValidationTypesHandler,
  ApprovalTypesHandler,
  ConfigurationTypesHandler,
  RegistrationGroupsHandler,
  // Actions
]).initialize();
