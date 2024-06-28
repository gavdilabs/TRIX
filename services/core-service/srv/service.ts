import { CDSDispatcher } from "@dxfrontier/cds-ts-dispatcher";
import AllocationTypesHandler from "./controller/functions/getAllocationTypes";
import RecordStatusHandler from "./controller/functions/getRecordStatuses";
import RegistrationTypesHandler from "./controller/functions/getRegistrationTypes";
import RegistrationStatusHandler from "./controller/functions/getRegistrationStatuses";
import GetActiveUserHandler from "./controller/functions/getActiveUserHandler";

export = new CDSDispatcher([
  // Entities
  // Functions
  AllocationTypesHandler,
  RecordStatusHandler,
  RegistrationStatusHandler,
  RegistrationTypesHandler,
  GetActiveUserHandler,
  // Actions
]).initialize();
