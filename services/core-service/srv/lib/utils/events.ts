import {
  AllocationEventContext,
  TimeRegistrationEventContext,
  UserEventContext,
} from "#cds-models/trix/core";

export enum ServiceEvents {
  TimeRegistrationCreated = "timeRegistrationCreated",
  TimeRegistrationUpdated = "timeRegistrationUpdated",
  TimeRegistrationDeleted = "timeRegistrationDeleted",
  AllocationCreated = "allocationCreated",
  AllocationUpdated = "allocationUpdated",
  AllocationDeleted = "allocationDeleted",
}

export interface AllocationCreatedContext {
  allocation: AllocationEventContext;
  allocatedUsers: UserEventContext[];
}

export interface AllocationUpdatedContext {
  allocation: AllocationEventContext;
  allocatedUsers: UserEventContext[];
}

export interface AllocationDeletedContext {
  allocation: AllocationEventContext;
  allocatedUsers: UserEventContext[];
}

export interface TimeRegistrationCreatedContext {
  registration: TimeRegistrationEventContext;
  user: UserEventContext;
}

export interface TimeRegistrationUpdatedContext {
  registration: TimeRegistrationEventContext;
  user: UserEventContext;
}

export interface TimeRegistrationDeletedContext {
  registration: TimeRegistrationEventContext;
  user: UserEventContext;
}
