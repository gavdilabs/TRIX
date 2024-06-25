// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../_';
export default { name: 'cats' }
export function _I_TimeSheetAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class I_TimeSheet extends Base {
        TimeSheetRecordUUID?: number;
        WorkAssignment?: number;
        TimeSheetRecord?: string | null;
        TimeSheetDate?: string | null;
        RecordedHours?: number | null;
        HoursUnitOfMeasure?: number | null;
        TimeSheetRecordLongText?: string | null;
        WBSElementInternalID?: number | null;
        ActivityType?: string | null;
        WorkItem?: string | null;
        BillableControl?: string | null;
        TimeSheetStatus?: string | null;
        TimeSheetPredecessorRecord?: string | null;
        TimeSheetAccountingDocument?: string | null;
        WorkflowTaskInternalID?: number | null;
        CreatedByUser?: string | null;
        LastChangedByUser?: string | null;
        TimeSheetApprovedByUser?: string | null;
        TimeSheetApprovedDate?: string | null;
        TimeSheetCreationDate?: string | null;
        TimeSheetEntryTime?: string | null;
        LastChangeDateTime?: string | null;
        TimeSheetLastChangedDate?: string | null;
        TimeSheetLastChangedTime?: string | null;
      static actions: {
    }
  };
}
export class I_TimeSheet extends _I_TimeSheetAspect(__.Entity) {}
export class I_TimeSheet_ extends Array<I_TimeSheet> {}
Object.defineProperty(I_TimeSheet, 'name', { value: 'cats.I_TimeSheet' })
Object.defineProperty(I_TimeSheet_, 'name', { value: 'cats.I_TimeSheet' })

export function _I_TimeSheetStatusTextAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class I_TimeSheetStatusText extends Base {
        Language?: string;
        TimeSheetStatus?: string;
        TimeSheetStatusText?: string | null;
      static actions: {
    }
  };
}
export class I_TimeSheetStatusText extends _I_TimeSheetStatusTextAspect(__.Entity) {}
export class I_TimeSheetStatusText_ extends Array<I_TimeSheetStatusText> {}
Object.defineProperty(I_TimeSheetStatusText, 'name', { value: 'cats.I_TimeSheetStatusText' })
Object.defineProperty(I_TimeSheetStatusText_, 'name', { value: 'cats.I_TimeSheetStatusText' })

export function _I_TimeSheetRecordAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class I_TimeSheetRecord extends Base {
        TimeSheetRecord?: string;
        PersonWorkAgreement?: number;
        TimeSheetDate?: string | null;
        WBSElementInternalID?: number | null;
        ActivityType?: string | null;
        WorkItem?: string | null;
        RecordedHours?: number | null;
        HoursUnitOfMeasure?: number | null;
        PurchaseOrder?: string | null;
        PurchaseOrderItem?: number | null;
        RecordedAmount?: number | null;
        Currency?: string | null;
        RecordedQuantity?: number | null;
        UnitOfMeasure?: number | null;
        ReceiverCostCenter?: string | null;
        SenderCostCenter?: string | null;
        InternalOrder?: string | null;
        ServiceDocumentType?: string | null;
        ServiceDocument?: string | null;
        ServiceDocumentItem?: number | null;
        ControllingArea?: string | null;
        TimeSheetTaskType?: string | null;
        TimeSheetTaskLevel?: string | null;
        TimeSheetTaskComponent?: string | null;
        CompanyCode?: string | null;
        TimeSheetNote?: string | null;
        TimeSheetStatus?: string | null;
        RejectionReason?: string | null;
        TimeSheetPredecessorRecord?: string | null;
        TimeSheetCreationDate?: string | null;
        TimeSheetEntryTime?: string | null;
        CreatedByUser?: string | null;
        LastChangedByUser?: string | null;
        TimeSheetApprovedByUser?: string | null;
        TimeSheetApprovedDate?: string | null;
        TimeSheetLastChangedDate?: string | null;
        TimeSheetLastChangedTime?: string | null;
        AccountingIndicatorCode?: string | null;
        WorkflowTaskInternalID?: number | null;
        TimeSheetWrkLocCode?: string | null;
        TimeSheetOvertimeCategory?: string | null;
        TimeSheetHasLongText?: string | null;
        TimeSheetAccountingDocument?: string | null;
        SenderPubSecFund?: string | null;
        SendingPubSecFunctionalArea?: string | null;
        SenderPubSecGrant?: string | null;
        SenderPubSecBudgetPeriod?: string | null;
        ReceiverPubSecFund?: string | null;
        ReceiverPubSecFuncnlArea?: string | null;
        ReceiverPubSecGrant?: string | null;
        ReceiverPubSecBudgetPeriod?: string | null;
      static actions: {
    }
  };
}
export class I_TimeSheetRecord extends _I_TimeSheetRecordAspect(__.Entity) {}
export class I_TimeSheetRecord_ extends Array<I_TimeSheetRecord> {}
Object.defineProperty(I_TimeSheetRecord, 'name', { value: 'cats.I_TimeSheetRecord' })
Object.defineProperty(I_TimeSheetRecord_, 'name', { value: 'cats.I_TimeSheetRecord' })
