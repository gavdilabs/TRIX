export enum ValidationMessage {
  ExceedElevenHourRule = "E1 - Registration exceeds 11 hour rule",
  ExceedFourtyEightHourRule = "E2 - Registration exceeds 48 hour rule",
  AbsenceInWorkHoursRule = "A1 - Absence is registered outside of working hours",
  MissingFieldsForValidation = "MF1 - Missing Fields for validation",
  MissingAllocationForRegistration = "MF2 - Missing allocation for registration",
  MissingSchedule = "MF3 - Missing schedule on worker",
  MissingWorkDay = "MF4 - Missing work day or assigned timespan",
  UnexpectedError = "U1 - Unexpected error occured while validating",
}

export interface ValidationResult {
  success: boolean;
  errorMsg?: ValidationMessage;
}

export interface RegistrationHours {
  workHours: number;
  absenceHours: number;
}
