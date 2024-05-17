import { trix } from "./entities-core";

export interface ITimeRegistrationAndAllocation
	extends trix.core.ITimeRegistration {
	allocation: trix.core.ITimeAllocation;
}
