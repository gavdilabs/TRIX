import { TimeRegistration } from "#cds-models/trix/core";
import { Repository } from "@dxfrontier/cds-ts-dispatcher";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";

@Repository()
export default class TimeRegistrationRepository extends BaseRepository<TimeRegistration> {
  constructor() {
    super(TimeRegistration);
  }
}