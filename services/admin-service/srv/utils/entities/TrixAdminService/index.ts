// This is an automatically generated file. Please do not change its contents manually!
import * as _trix_admin from './../trix/admin';
import * as __ from './../_';
import * as _ from './..';
import * as _trix_common_types from './../trix/common/types';
export default { name: 'TrixAdminService' }
export function _ConfigurationSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class ConfigurationSet extends Base {
        companyName?: string | null;
        configurationType?: _trix_admin.ConfigurationType | null;
        approvalEnabled?: boolean | null;
        approvalType?: _trix_admin.ApprovalType | null;
        validationRules?: __.Association.to.many<_trix_admin.ValidationRule_>;
        registrationTypes?: __.Association.to.many<_trix_admin.RegistrationType_>;
      static actions: {
    }
  };
}
export class ConfigurationSet extends _._cuidAspect(_._managedAspect(_ConfigurationSetAspect(__.Entity))) {}
export class ConfigurationSet_ extends Array<ConfigurationSet> {}
Object.defineProperty(ConfigurationSet, 'name', { value: 'TrixAdminService.ConfigurationSet' })
Object.defineProperty(ConfigurationSet_, 'name', { value: 'TrixAdminService.ConfigurationSet' })

export function _RegistrationTypeSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class RegistrationTypeSet extends Base {
        group?: _trix_admin.RegistrationGroup | null;
      static actions: {
    }
  };
}
export class RegistrationTypeSet extends _._cuidAspect(_._managedAspect(_RegistrationTypeSetAspect(__.Entity))) {}
export class RegistrationTypeSet_ extends Array<RegistrationTypeSet> {}
Object.defineProperty(RegistrationTypeSet, 'name', { value: 'TrixAdminService.RegistrationTypeSet' })
Object.defineProperty(RegistrationTypeSet_, 'name', { value: 'TrixAdminService.RegistrationTypeSet' })

export function _ValidationRuleSetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class ValidationRuleSet extends Base {
        rule?: _trix_admin.ValidationType;
        enabled?: boolean | null;
      static actions: {
    }
  };
}
export class ValidationRuleSet extends _._managedAspect(_ValidationRuleSetAspect(__.Entity)) {}
export class ValidationRuleSet_ extends Array<ValidationRuleSet> {}
Object.defineProperty(ValidationRuleSet, 'name', { value: 'TrixAdminService.ValidationRuleSet' })
Object.defineProperty(ValidationRuleSet_, 'name', { value: 'TrixAdminService.ValidationRuleSet' })

// action
export declare const getApprovalTypes: { (): Array<_trix_common_types.EnumPair>, __parameters: {}, __returns: Array<_trix_common_types.EnumPair> };
// action
export declare const getValidationTypes: { (): Array<_trix_common_types.EnumPair>, __parameters: {}, __returns: Array<_trix_common_types.EnumPair> };
// action
export declare const getConfigurationTypes: { (): Array<_trix_common_types.EnumPair>, __parameters: {}, __returns: Array<_trix_common_types.EnumPair> };
// action
export declare const getRegistrationGroups: { (): Array<_trix_common_types.EnumPair>, __parameters: {}, __returns: Array<_trix_common_types.EnumPair> };