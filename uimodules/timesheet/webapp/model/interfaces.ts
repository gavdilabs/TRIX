import { trix } from "./entities-core";

export interface ITimeRegistrationAndAllocation
	extends trix.core.ITimeRegistration {
	allocation: trix.core.ITimeAllocation;
}

export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;