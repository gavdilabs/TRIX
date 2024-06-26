// This is an automatically generated file. Please do not change its contents manually!
const cds = require('@sap/cds')
const csn = cds.entities('trix.admin')
module.exports.ValidationRule = csn.ValidationRule
module.exports.ValidationRule_ = csn.ValidationRule
module.exports.RegistrationType = csn.RegistrationType
module.exports.RegistrationType_ = csn.RegistrationType
module.exports.Configuration = csn.Configuration
module.exports.Configuration_ = csn.Configuration
// events
// actions
// enums
module.exports.SolutionType ??= { Standalone: 0, S4: 1, ECC: 2, SuccessFactors: 3 }
module.exports.ApprovalType ??= { Manual: 0, BackgroundJob: 1, Auto: 3, ExternalIntegration: 4 }
module.exports.ValidationType ??= { None: 0, ElevenHourRule: 1, FourtyEightHourRule: 2, AbsenceInWorkHours: 3 }
module.exports.ConfigurationType ??= { Global: 0 }
module.exports.RegistrationGroup ??= { Project: 0, Service: 1, AbsenceAttendance: 2, Custom: 3 }
