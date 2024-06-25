// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../../_';
import * as _ from './../..';
// enum
export const SolutionType = {
  Standalone: 0,
  S4: 1,
  ECC: 2,
  SuccessFactors: 3,
} as const;
export type SolutionType = 0 | 1 | 2 | 3

// enum
export const ApprovalType = {
  Manual: 0,
  BackgroundJob: 1,
  Auto: 3,
  ExternalIntegration: 4,
} as const;
export type ApprovalType = 0 | 1 | 3 | 4

// enum
export const ValidationType = {
  None: 0,
  ElevenHourRule: 1,
  FourtyEightHourRule: 2,
  AbsenceInWorkHours: 3,
} as const;
export type ValidationType = 0 | 1 | 2 | 3

// enum
export const ConfigurationType = {
  Global: 0,
} as const;
export type ConfigurationType = 0

// enum
export const RegistrationGroup = {
  Project: 0,
  Service: 1,
  AbsenceAttendance: 2,
  Custom: 3,
} as const;
export type RegistrationGroup = 0 | 1 | 2 | 3

export function _ValidationRuleAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class ValidationRule extends Base {
        rule?: ValidationType;
        enabled?: boolean | null;
      static actions: {
    }
  };
}
export class ValidationRule extends _._managedAspect(_ValidationRuleAspect(__.Entity)) {}
export class ValidationRule_ extends Array<ValidationRule> {}
Object.defineProperty(ValidationRule, 'name', { value: 'trix.admin.ValidationRule' })
Object.defineProperty(ValidationRule_, 'name', { value: 'trix.admin.ValidationRule' })

export function _RegistrationTypeAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class RegistrationType extends Base {
        group?: RegistrationGroup | null;
      static actions: {
    }
  };
}
export class RegistrationType extends _._cuidAspect(_._managedAspect(_RegistrationTypeAspect(__.Entity))) {}
export class RegistrationType_ extends Array<RegistrationType> {}
Object.defineProperty(RegistrationType, 'name', { value: 'trix.admin.RegistrationType' })
Object.defineProperty(RegistrationType_, 'name', { value: 'trix.admin.RegistrationType' })

export function _ConfigurationAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Configuration extends Base {
        companyName?: string | null;
        configurationType?: ConfigurationType | null;
        approvalEnabled?: boolean | null;
        approvalType?: ApprovalType | null;
        validationRules?: __.Association.to.many<ValidationRule_>;
        registrationTypes?: __.Association.to.many<RegistrationType_>;
      static actions: {
    }
  };
}
export class Configuration extends _._cuidAspect(_._managedAspect(_ConfigurationAspect(__.Entity))) {}
export class Configuration_ extends Array<Configuration> {}
Object.defineProperty(Configuration, 'name', { value: 'trix.admin.Configuration' })
Object.defineProperty(Configuration_, 'name', { value: 'trix.admin.Configuration' })
