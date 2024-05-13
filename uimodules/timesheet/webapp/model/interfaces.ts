export interface ITimeRegistration {
    "ID": string,
    "createdAt": Date | null,
    "createdBy": string,
    "modifiedAt": Date | null,
    "modifiedBy": string,
    "startDate": Date | null,
    "endDate": Date | null,
    "startTime": ITime,
    "endTime": ITime,
    "wholeDay": boolean,
    "amount": number,
    "registrationStatus": number,
    "registrationType": number,
    "comment": string,
    "invalid": boolean,
    "statusContext": string,
    "recordStatus": number,
    "user_userID": string,
    "allocation_ID": string
}

export interface IAllocation 
{
  "ID": string,
  "createdAt": Date | null,
  "createdBy": string,
  "modifiedAt": Date | null,
  "modifiedBy": string,
  "validFrom": Date | null,
  "validTo": Date | null,
  "description": string,
  "isAbsence": false,
  "allocationType": string
  }

export interface ITimeRegistrationAndAllocation extends ITimeRegistration {
  allocation: IAllocation;
}

export interface ITime{
  hour: number,
  minut: number,
  second: number
}

export interface ITRIXCalendarRecord {
  startDate: Date,
  endDate: Date,
  title: string,
  text: string
}