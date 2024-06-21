using {trix.core as model} from '../db/schema';
using {trix.common.types} from '../../shared/types';

@path    : 'core'
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
      isManager = true
    actions {
      function getTeam()    returns TeamSet;
      function getReports() returns many UserSet;
    };

  entity TimeAllocationSet @(restrict: [
    {
      grant: ['READ'],
      to   : ['TimeUser'],
      where: 'allocatedUsers.userID = $user.id'
    },
    {
      grant: ['READ'],
      to   : []
    },
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
      to   : ['TimeUser'],
      where: 'userID = $user.id'
    },
    {
      grant: ['READ'],
      to   : ['TeamLead']
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
      grant: [
        'READ',
        'clockIn',
        'clockOut',
        'elapsedTime'
      ],
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
  ])                as projection on model.TimeRegistration actions {
                         action   clockIn()     returns String;
                         action   clockOut()    returns String;
                         function elapsedTime() returns DateTime;
                         action   validate()    returns Boolean;
                       };

  entity WorkScheduleSet @(restrict: [
    {
      grant: ['READ'],
      to   : ['TimeUser'],
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
    {grant: [
      'READ',
      'getTeamSize'
    ]},
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
  ])                as projection on model.Team actions {
                         function getTeamSize() returns Integer;
                       };

  /** FUNCTION IMPORTS **/
  function getRecordStatuses()       returns many types.EnumPair;
  function getRegistrationStatuses() returns many types.EnumPair;
  function getRegistrationTypes()    returns many types.EnumPair;
  function getAllocationTypes()      returns many model.AllocationType;

/** ACTION IMPORTS **/
// NOTE: All unbound actions should go here

}
