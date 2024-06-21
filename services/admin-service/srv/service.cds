using {trix.admin as schema} from '../db/schema';
using {trix.common.types} from '../../shared/types';

@requires: 'authenticated-user'
service TrixAdminService {

  entity ConfigurationSet @(restrict: [
    {grant: ['READ']},
    {
      grant: ['*'],
      to   : ['Admin']
    }
  ]) as projection on schema.Configuration;

  entity RegistrationTypeSet @(restrict: [
    {grant: ['READ']},
    {
      grant: ['*'],
      to   : ['Admin']
    }
  ]) as projection on schema.RegistrationType;

  entity ValidationRuleSet @(restrict: [
    {grant: ['READ']},
    {
      grant: ['*'],
      to   : ['Admin']
    }
  ]) as projection on schema.ValidationRule;

  /** FUNCTION IMPORTS **/
  function getApprovalTypes()      returns many types.EnumPair;

  annotate getApprovalTypes with @(restrict: [
    {to: 'Admin'},
    {to: 'system-user'}
  ]);

  function getValidationTypes()    returns many types.EnumPair;

  annotate getValidationTypes with @(restrict: [
    {to: 'Admin'},
    {to: 'system-user'}
  ]);

  function getConfigurationTypes() returns many types.EnumPair;

  annotate getConfigurationTypes with @(restrict: [
    {to: 'Admin'},
    {to: 'system-user'}
  ]);

  function getRegistrationGroups() returns many types.EnumPair;

  annotate getRegistrationGroups with @(restrict: [
    {to: 'Admin'},
    {to: 'system-user'}
  ]);

}
