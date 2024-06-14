using {TrixCoreService} from './service';
using {trix.core as model} from '../db/schema';

extend service TrixCoreService with {
  /** EVENTS **/
  event timeRegistrationCreated {
    registration : model.TimeRegistrationEventContext;
    user         : model.UserEventContext;
  }

  event timeRegistrationUpdated {
    registration : model.TimeRegistrationEventContext;
    user         : model.UserEventContext;
  }

  event timeRegistrationDeleted {
    registration : model.TimeRegistrationEventContext;
    user         : model.UserEventContext;
  }

  event allocationCreated {
    allocation : model.AllocationEventContext;
  }

  event allocationUpdated {
    allocation : model.AllocationEventContext;
  }

  event allocationDeleted {
    allocation : model.AllocationEventContext;
  }
}
