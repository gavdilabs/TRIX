import { User2Allocation } from "../utils/entities/trix/core";
import { Repository } from "@dxfrontier/cds-ts-dispatcher";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";

@Repository()
export default class User2AllocationRepository extends BaseRepository<User2Allocation> {
  constructor() {
    super(User2Allocation);
  }
}
