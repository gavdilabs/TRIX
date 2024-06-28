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
      isManager = true;

  entity TimeAllocationSet @(restrict: [
    {
      grant: ['READ'],
      to   : ['TimeUser'],
      where: 'allocatedUsers.userID = $user.id'
    },
    {
      grant: ['READ'],
      where: 'allocatedUsers.substitute.userID = $user.id'
    },
    {
      grant: ['READ'],
      where: 'allocatedUsers.manager.userID = $user.id'
    },
    {
      grant: ['*'],
      to   : [
        'Admin',
        'AllocationManagement'
      ]
    }
  ])                as projection on model.TimeAllocation;


  entity TimeAllocationGroupSet @(restrict: [
    {
      grant: ['READ'],
      to   : ['TimeUser'],
      where: 'allocatedUsers.userID = $user.id'
    },
    {
      grant: ['READ'],
      where: 'allocatedUsers.substitute.userID = $user.id'
    },
    {
      grant: ['READ'],
      where: 'allocatedUsers.manager.userID = $user.id'
    },
    {
      grant: ['*'],
      to   : [
        'Admin',
        'AllocationManagement'
      ]
    }
  ])                as projection on model.TimeAllocationGroup;


  entity User2AllocationSet @(restrict: [
    {
      grant: ['READ'],
      to   : ['TimeUser'],
      where: 'userID = $user.id'
    },
    {
      grant: ['READ'],
      where: 'allocation.allocatedUsers.manager.userID = $user.id'
    },
    {
      grant: ['READ'],
      where: 'allocation.allocatedUsers.substitute.userID = $user.id'
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
      grant: ['*'],
      to   : ['TimeUser'],
      where: 'user.userID = $user.id'
    },
    {
      grant: ['*'],
      to   : ['TimeUser'],
      where: 'user.manager.userID = $user.id'
    },
    {
      grant: ['*'],
      to   : ['TimeUser'],
      where: 'user.substitute.userID = $user.id'
    },
    {
      grant: ['*'],
      to   : [
        'Admin',
        'TimeRegistration',
        'TimeManagement'
      ]
    }
  ])                as projection on model.TimeRegistration actions {
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
      grant: ['*'],
      where: 'user.manager.userID = $user.id'
    },
    {
      grant: ['*'],
      where: 'user.substitute.userID = $user.id'
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
      grant: ['*'],
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
      grant: ['*'],
      to   : [
        'Admin',
        'WorkScheduleManagement'
      ]
    }
  ])                as projection on model.WorkDay;

  entity TeamSet @(restrict: [
    {
      grant: [
        'READ',
        'getTeamSize'
      ],
      where: 'members.userID = $user.id'
    },
    {
      grant: ['*'],
      where: 'manager.userID = $user.id'
    },
    {
      grant: ['*'],
      where: 'manager.substitute.userID = $user.id'
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
  function getAllocationTypes()      returns many String;
  function getActiveUser()           returns UserSet;

/** ACTION IMPORTS **/
// NOTE: All unbound actions should go here

}
