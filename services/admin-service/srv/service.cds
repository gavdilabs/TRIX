using {trix.admin as schema} from '../db/schema';

@requires: 'authenticated-user'
service TrixAdminService {

  // NOTE: TimeUser or similar grants access to read certain solution critical fields
  // NOTE: SolutionManagement grants access to configure solution
  // NOTE: SolutionAdmin grants all access

  entity ConfigurationSet    as projection on schema.Configuration;
  entity RegistrationTypeSet as projection on schema.RegistrationType;
  entity ValidationRuleSet   as projection on schema.ValidationRule;
  function getApprovalTypes()      returns many Integer;
  function getValidationTypes()    returns many Integer;
  function getConfigurationTypes() returns many Integer;
  function getRegistrationGroups() returns many Integer;
  function ping(msg : String null) returns String;

}
