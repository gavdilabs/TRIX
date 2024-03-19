@cds.external : true
@m.IsDefaultEntityContainer : 'true'
service CATS {};

@cds.external : true
@cds.persistence.skip : true
@sap.label : 'Timesheet'
@sap.creatable : 'true'
@sap.updatable : 'true'
@sap.upsertable : 'true'
@sap.deletable : 'true'
entity CATS.I_TimeSheet {

    @sap.label : 'Globally Unique Identifier'
    key TimeSheetRecordUUID: Integer; //RAW 16

    @sap.label : 'Personnel Number'
    key WorkAssignment: Integer; //NUMC 8

    @sap.label : 'Counter for Records in Time Recording'
    TimeSheetRecord: String(12); //CHAR 12

    @sap.label: 'Date'
    TimeSheetDate: Date; //DATS 8

    @sap.label : 'Hours'
    RecordedHours: Integer; //QUAN 4

    @sap.label : 'Unit of Measure for Display'
    HoursUnitOfMeasure: Integer; //UNIT 3

    @sap.label : 'Timesheet long text'
    TimeSheetRecordLongText: String(1000); //CHAR 1,000

    @sap.label : 'WBS Element'
    WBSElementInternalID: Integer; //NUMC 8

    @sap.label: 'Activity Type'
    ActivityType: String(6); //CHAR 6

    @sap.label: 'Work Item'
    WorkItem: String(10); //CHAR 10

    @sap.label: 'Accounting Indicator'
    BillableControl: String(2); //CHAR 2

    @sap.label: 'Processing Status'
    TimeSheetStatus: String(2); //CHAR 2

    @sap.label: 'Reference Counter for Record to be Changed'
    TimeSheetPredecessorRecord: String(12); //CHAR 12

    @sap.label: 'Document Number'
    TimeSheetAccountingDocument: String(10); //CHAR 10

    @sap.label: 'Work item ID'
    WorkflowTaskInternalID: Integer; //NUMC 12

    @sap.label : 'User Creating Record'
    CreatedByUser: String(12); //CHAR 12

    @sap.label : 'Name of Person Who Changed Object'
    LastChangedByUser: String(12); //CHAR 12

    @sap.label: 'Name of person who approved data'
    TimeSheetApprovedByUser: String(12); //CHAR 12

    @sap.label : 'Date of approval'
    TimeSheetApprovedDate: Date; //DATS 8

    @sap.label: 'Created On'
    TimeSheetCreationDate: Date; //DATS 8

    @sap.label : 'Time of Entry'
    TimeSheetEntryTime: Time; //TIMS 6

    @sap.label : 'Last Change Date Time'
    LastChangeDateTime: DateTime; //DEC 21

    @sap.label : 'Date of Last Change'
    TimeSheetLastChangedDate: Date; //DATS 8

    @sap.label : 'Time of Last Change'
    TimeSheetLastChangedTime: Time; //TIMS 6
}

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'true'
@sap.upsertable : 'true'
@sap.deletable : 'true'
entity CATS.I_TimeSheetStatusText {

    @sap.label: 'Language Key'
    key Language: String(1); //LANG 1

    @sap.label: 'Values for Domains: Single Value/Lower Limit'
    key TimeSheetStatus: String(10); //CHAR 10

    @sap.label: 'Timesheet Status Text'
    TimeSheetStatusText: String(60); //CHAR 60
}

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'true'
@sap.updatable : 'true'
@sap.upsertable : 'true'
@sap.deletable : 'true'
entity CATS.I_TimeSheetRecord {

    @sap.label : 'Counter for Records in Time Recording'
    key TimeSheetRecord: String(12); //CHAR 12

    @sap.label : 'Personnel Number'
    key PersonWorkAgreement: Integer; //NUMC 8

    @sap.label : 'Date'
    TimeSheetDate: Date; //DATS 8

    @sap.label : 'WBS Element'
    WBSElementInternalID: Integer; //NUMC 8

    @sap.label : 'Activity Type'
    ActivityType: String(6); //CHAR 6

    @sap.label : 'Work Item ID'
    WorkItem: String(10); //CHAR 10

    @sap.label : 'Hours'
    RecordedHours: Integer; //QUAN 4

    @sap.label : 'Unit of Measure for Display'
    HoursUnitOfMeasure: Integer; //UNIT 3

    @sap.label : 'Sending purchase order'
    PurchaseOrder: String(10); //CHAR 10

    @sap.label : 'Sending purchase order item'
    PurchaseOrderItem: Integer; //NUMC 5

    @sap.label : 'CATS Amount'
    RecordedAmount: Integer; //CURR 13

    @sap.label : 'Currency Key'
    Currency: String(5); //CUKY 5

    @sap.label : 'Time Sheet: Number (Unit of Measure)'
    RecordedQuantity: Integer; //QUAN 15

    @sap.label : 'Unit of Measurement'
    UnitOfMeasure: Integer; //UNIT 3

    @sap.label : 'Receiver Cost Center'
    ReceiverCostCenter: String(10); //CHAR 10

    @sap.label : 'Sender Cost Center'
    SenderCostCenter: String(10); //CHAR 10

    @sap.label : 'Receiver Order'
    InternalOrder: String(12); //CHAR 12

    @sap.label : 'Service Document Type'
    ServiceDocumentType: String(4); //CHAR 4

    @sap.label : 'Service Document ID'
    ServiceDocument: String(10); //CHAR 10

    @sap.label : 'Service Document Item ID'
    ServiceDocumentItem: Integer; //NUMC 6

    @sap.label : 'Controlling Area'
    ControllingArea: String(4); //CHAR 4

    @sap.label : 'Task Type'
    TimeSheetTaskType: String(4); //CHAR 4

    @sap.label : 'Task Level'
    TimeSheetTaskLevel: String(8); //CHAR 8

    @sap.label : 'Task component'
    TimeSheetTaskComponent: String(8); //CHAR 8

    @sap.label : 'Company Code'
    CompanyCode: String(4); //CHAR 4

    @sap.label : 'Short Text'
    TimeSheetNote: String(40); //CHAR 40

    @sap.label : 'Processing Status'
    TimeSheetStatus: String(2); //CHAR 2

    @sap.label : 'Reason for rejection'
    RejectionReason: String(4); //CHAR 4

    @sap.label : 'Reference Counter for Record to be Changed'
    TimeSheetPredecessorRecord: String(12); //CHAR 12

    @sap.label : 'Created On'
    TimeSheetCreationDate: Date; //DATS 8

    @sap.label : 'Time of Entry'
    TimeSheetEntryTime: Time; //TIMS 6

    @sap.label : 'User Creating Record'
    CreatedByUser: String(12); //CHAR 12

    @sap.label : 'Name of Person Who Changed Object'
    LastChangedByUser: String(12); //CHAR 12

    @sap.label : 'Name of person who approved data'
    TimeSheetApprovedByUser: String(12); //CHAR 12

    @sap.label : 'Date of Approval'
    TimeSheetApprovedDate: Date; //DATS 8

    @sap.label : 'Date of Last Change'
    TimeSheetLastChangedDate: Date; //DATS 8

    @sap.label : 'Time of Last Change'
    TimeSheetLastChangedTime: Time; //TIMS 6

    @sap.label : 'Accounting Indicator'
    AccountingIndicatorCode: String(2); //CHAR 2

    @sap.label : 'Work item ID'
    WorkflowTaskInternalID: Integer; //NUMC 12

    @sap.label : 'Tax area work center'
    TimeSheetWrkLocCode: String(4); //CHAR 4

    @sap.label : 'Overtime Category'
    TimeSheetOvertimeCategory: String(4); //CHAR 4

    @sap.label : 'Long Text'
    TimeSheetHasLongText: String(1); //CHAR 1

    @sap.label : 'Document Number'
    TimeSheetAccountingDocument: String(10); //CHAR 10

    @sap.label : 'Sender fund'
    SenderPubSecFund: String(10); //CHAR 10

    @sap.label : 'Sending Functional Area'
    SendingPubSecFunctionalArea: String(16); //CHAR 16

    @sap.label : 'Sender Grant'
    SenderPubSecGrant: String(20); //CHAR 20

    @sap.label : 'FM: Sender Budget Period'
    SenderPubSecBudgetPeriod: String(10); //CHAR 10

    @sap.label : 'Receiver Fund'
    ReceiverPubSecFund: String(10); //CHAR 10

    @sap.label : 'Receiving Functional Area'
    ReceiverPubSecFuncnlArea: String(16); //CHAR 16

    @sap.label : 'Receiver Grant'
    ReceiverPubSecGrant: String(20); //CHAR 20

    @sap.label : 'FM: Receiver Budget Period'
    ReceiverPubSecBudgetPeriod: String(10); //CHAR 10
}



