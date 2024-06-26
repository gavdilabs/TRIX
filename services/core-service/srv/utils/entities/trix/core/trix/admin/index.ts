// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './../../../..';
import * as _trix_admin from './../../../admin';
import * as __ from './../../../../_';
/**
* Aspect to capture changes by user and name
* 
* See https://cap.cloud.sap/docs/cds/common#aspect-managed
*/
export function _SolutionConfigurationAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class SolutionConfiguration extends Base {
        ID?: string;
        createdAt?: string | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: string | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
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
export class SolutionConfiguration extends _._cuidAspect(_._managedAspect(_SolutionConfigurationAspect(__.Entity))) {}
export class SolutionConfiguration_ extends Array<SolutionConfiguration> {}
Object.defineProperty(SolutionConfiguration, 'name', { value: 'trix.core.trix.admin.SolutionConfiguration' })
Object.defineProperty(SolutionConfiguration_, 'name', { value: 'trix.core.trix.admin.SolutionConfiguration' })

/**
* Aspect to capture changes by user and name
* 
* See https://cap.cloud.sap/docs/cds/common#aspect-managed
*/
export function _ValidationRuleAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class ValidationRule extends Base {
        createdAt?: string | null;
    /**
    * Canonical user ID
    */
        createdBy?: _.User | null;
        modifiedAt?: string | null;
    /**
    * Canonical user ID
    */
        modifiedBy?: _.User | null;
        rule?: _trix_admin.ValidationType;
        enabled?: boolean | null;
      static actions: {
    }
  };
}
export class ValidationRule extends _._managedAspect(_ValidationRuleAspect(__.Entity)) {}
export class ValidationRules extends Array<ValidationRule> {}
Object.defineProperty(ValidationRule, 'name', { value: 'trix.core.trix.admin.ValidationRules' })
Object.defineProperty(ValidationRules, 'name', { value: 'trix.core.trix.admin.ValidationRules' })
