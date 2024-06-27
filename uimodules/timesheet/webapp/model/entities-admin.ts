export namespace trix.admin {
  export enum SolutionType {
    Standalone,
    S4 = 1,
    ECC = 2,
    SuccessFactors = 3,
  }

  export enum ApprovalType {
    Manual,
    BackgroundJob = 1,
    Auto = 3,
    ExternalIntegration = 4,
  }

  export enum ValidationType {
    None,
    ElevenHourRule = 1,
    FourtyEightHourRule = 2,
    AbsenceInWorkHours = 3,
  }

  export enum ConfigurationType {
    Global,
  }

  export interface IValidationRule {
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    rule: ValidationType;
    enabled: boolean;
  }

  export interface IRegistrationGroup {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    name: string;
    description: string;
  }

  export interface IRegistrationType {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    name: string;
    description: string;
    group?: IRegistrationGroup;
    group_ID?: string;
  }

  export interface IConfiguration {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    companyName: string;
    configurationType: ConfigurationType;
    approvalEnabled: boolean;
    approvalType: ApprovalType;
    validationRules?: IValidationRule[];
    registrationTypes?: IRegistrationType[];
  }

  export enum Entity {
    ValidationRule = "trix.admin.ValidationRule",
    RegistrationGroup = "trix.admin.RegistrationGroup",
    RegistrationType = "trix.admin.RegistrationType",
    Configuration = "trix.admin.Configuration",
  }

  export enum SanitizedEntity {
    ValidationRule = "ValidationRule",
    RegistrationGroup = "RegistrationGroup",
    RegistrationType = "RegistrationType",
    Configuration = "Configuration",
  }
}

export namespace trix.common.types {
  export interface IEnumPair {
    name: string;
    index: number;
  }

  export enum Entity {
    EnumPair = "trix.common.types.EnumPair",
  }

  export enum SanitizedEntity {
    EnumPair = "EnumPair",
  }
}

export namespace sap.common {
  export interface ILanguages {
    name: string;
    descr: string;
    code: string;
    texts: ITexts[];
    localized?: ITexts;
  }

  export interface ICountries {
    name: string;
    descr: string;
    code: string;
    texts: ITexts[];
    localized?: ITexts;
  }

  export interface ICurrencies {
    name: string;
    descr: string;
    code: string;
    symbol: string;
    texts: ITexts[];
    localized?: ITexts;
  }

  export interface ITexts {
    locale: string;
    name: string;
    descr: string;
    code: string;
  }

  export interface ITexts {
    locale: string;
    name: string;
    descr: string;
    code: string;
  }

  export interface ITexts {
    locale: string;
    name: string;
    descr: string;
    code: string;
  }

  export enum Entity {
    Languages = "sap.common.Languages",
    Countries = "sap.common.Countries",
    Currencies = "sap.common.Currencies",
    Texts = "sap.common.Currencies.texts",
  }

  export enum SanitizedEntity {
    Languages = "Languages",
    Countries = "Countries",
    Currencies = "Currencies",
    Texts = "Texts",
  }
}

export namespace TrixAdminService {
  export interface IConfigurationSet {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    companyName: string;
    configurationType: trix.admin.ConfigurationType;
    approvalEnabled: boolean;
    approvalType: trix.admin.ApprovalType;
    validationRules?: IValidationRuleSet[];
    registrationTypes?: IRegistrationTypeSet[];
  }

  export interface IRegistrationGroupSet {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    name: string;
    description: string;
  }

  export interface IRegistrationTypeSet {
    ID: string;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    name: string;
    description: string;
    group?: IRegistrationGroupSet;
    group_ID?: string;
  }

  export interface IValidationRuleSet {
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    rule: trix.admin.ValidationType;
    enabled: boolean;
  }

  export enum FuncGetApprovalTypes {
    name = "getApprovalTypes",
  }

  export type FuncGetApprovalTypesReturn = trix.common.types.IEnumPair[];

  export enum FuncGetValidationTypes {
    name = "getValidationTypes",
  }

  export type FuncGetValidationTypesReturn = trix.common.types.IEnumPair[];

  export enum FuncGetConfigurationTypes {
    name = "getConfigurationTypes",
  }

  export type FuncGetConfigurationTypesReturn = trix.common.types.IEnumPair[];

  export enum FuncGetRegistrationGroups {
    name = "getRegistrationGroups",
  }

  export type FuncGetRegistrationGroupsReturn = trix.common.types.IEnumPair[];

  export enum Entity {
    ConfigurationSet = "TrixAdminService.ConfigurationSet",
    RegistrationGroupSet = "TrixAdminService.RegistrationGroupSet",
    RegistrationTypeSet = "TrixAdminService.RegistrationTypeSet",
    ValidationRuleSet = "TrixAdminService.ValidationRuleSet",
  }

  export enum SanitizedEntity {
    ConfigurationSet = "ConfigurationSet",
    RegistrationGroupSet = "RegistrationGroupSet",
    RegistrationTypeSet = "RegistrationTypeSet",
    ValidationRuleSet = "ValidationRuleSet",
  }
}

export type User = string;

export enum Entity {}

export enum SanitizedEntity {}
