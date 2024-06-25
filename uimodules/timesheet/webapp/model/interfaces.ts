import { trix } from "./entities-core";

/**
 * Controlled interface based on the model entities
 */
export interface ITimeRegistrationAndAllocation
	extends trix.core.ITimeRegistration {
	allocation: trix.core.ITimeAllocation;
}

/**
 * Tooling interface for allowing a Partial to consider nested structures
 */
export type DeepPartial<T> = T extends object ? {[P in keyof T]?: DeepPartial<T[P]>;
}:T;

export enum Day {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 0,
}
