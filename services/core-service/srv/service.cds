using {trix.core as model} from '../db/schema';

@requires: 'authenticated-user'
service TrixCoreService {

  entity UserSet @(restrict: [
    {grant: ['READ']},
    {
      grant: ['*'],
      to   : [
        'Admin',
        'UserManagement'
      ]
    },
    {
      grant: ['CHANGE'],
      where: 'userID = $user.id'
    }
  ])                as projection on model.User;

  @readonly
  entity ManagerSet as
    select from UserSet
    where
      isManager = true;

  entity TimeAllocationSet @(restrict: [
    {grant: ['READ']},
    {
      grant: ['*'],
      to   : [
        'Admin',
        'AllocationManagement'
      ]
    }
  ])                as projection on model.TimeAllocation;

  entity User2AllocationSet @(restrict: [
    {
      grant: ['READ'],
      to   : [
        'TimeUser',
        'TeamLead'
      ]
    },
    {
      grant: ['*'],
      to   : [
        'Admin',
        'AllocationManagement'
      ]
    }
  ])                as projection on model.User2Allocation;

  entity TimeRegistrationSet @(restrict: [
    {
      grant: ['READ'],
      to   : ['TimeUser']
    },
    {
      grant: ['*'],
      to   : [
        'Admin',
        'TimeRegistration',
        'TimeManagement',
        'TeamLead'
      ]
    }
  ])                as projection on model.TimeRegistration;

  entity WorkScheduleSet @(restrict: [
    {
      grant: ['READ'],
      where: 'user.userID = $user.id'
    },
    {
      grant: ['READ'],
      to   : ['TeamLead']
    },
    {
      grant: ['*'],
      to   : [
        'Admin',
        'WorkScheduleManagement'
      ]
    }
  ])                as projection on model.WorkSchedule;

  entity WorkWeekSet @(restrict: [
    {
      grant: ['READ'],
      to   : [
        'TimeUser',
        'TeamLead'
      ]
    },
    {
      grant: ['CHANGE'],
      to   : ['TeamLead']
    },
    {
      grant: ['*'],
      to   : [
        'Admin',
        'WorkScheduleManagement'
      ]
    }
  ])                as projection on model.WorkWeek;

  entity WorkDaySet @(restrict: [
    {
      grant: ['READ'],
      to   : [
        'TimeUser',
        'TeamLead'
      ]
    },
    {
      grant: ['CHANGE'],
      to   : ['TeamLead']
    },
    {
      grant: ['*'],
      to   : [
        'Admin',
        'WorkScheduleManagement'
      ]
    }
  ])                as projection on model.WorkDay;

  entity TeamSet @(restrict: [
    {grant: ['READ']},
    {
      grant: ['CHANGE'],
      to   : ['TeamLead']
    },
    {
      grant: ['*'],
      to   : [
        'Admin',
        'TeamManagement'
      ]
    }
  ])                as projection on model.Team;

  /** FUNCTION IMPORTS **/
  function ping(msg : String null) returns String;

/** ACTION IMPORTS **/
}
