// This is an automatically generated file. Please do not change its contents manually!
const cds = require('@sap/cds')
const csn = cds.entities('trix.core')
module.exports.TimeAllocation = csn.TimeAllocation
module.exports.TimeAllocation_ = csn.TimeAllocation
module.exports.User = csn.User
module.exports.User_ = csn.User
module.exports.User2Allocation = csn.User2Allocation
module.exports.User2Allocation_ = csn.User2Allocation
module.exports.TimeRegistration = csn.TimeRegistration
module.exports.TimeRegistration_ = csn.TimeRegistration
module.exports.WorkSchedule = csn.WorkSchedule
module.exports.WorkSchedule_ = csn.WorkSchedule
module.exports.WorkWeek = csn.WorkWeek
module.exports.WorkWeek_ = csn.WorkWeek
module.exports.WorkDay = csn.WorkDay
module.exports.WorkDay_ = csn.WorkDay
module.exports.Team = csn.Team
module.exports.Team_ = csn.Team
module.exports.WeeklyRecording = csn.WeeklyRecording
module.exports.WeeklyRecording_ = csn.WeeklyRecording
module.exports.TimeRegistrationEventContext = csn.TimeRegistrationEventContext
module.exports.TimeRegistrationEventContext_ = csn.TimeRegistrationEventContext
module.exports.UserEventContext = csn.UserEventContext
module.exports.UserEventContext_ = csn.UserEventContext
module.exports.AllocationEventContext = csn.AllocationEventContext
module.exports.AllocationEventContext_ = csn.AllocationEventContext
// events
// actions
// enums
module.exports.RecordStatus ??= { Awaiting: 0, Processing: 1, Complete: 2, Error: 3 }
module.exports.RegistrationStatus ??= { InProcess: 1, Complete: 2, Approved: 3, Rejected: 4 }
module.exports.RegistrationType ??= { Manual: 0, ClockInOut: 1 }
module.exports.AllocationType ??= { Project: "Project", Service: "Service", AbsenceAttendance: "AbsenceAttendance" }
