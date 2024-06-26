import { User as UserEntity } from "../utils/entities/trix/core";
import {
  Inject,
  Repository,
  Service,
  SRV,
} from "@dxfrontier/cds-ts-dispatcher";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";
import cds from "@sap/cds";

const { User } = cds.entities;

@Repository()
export default class UserRepository extends BaseRepository<UserEntity> {
  @Inject(SRV)
  private srv: Service;

  constructor() {
    super(UserEntity);
  }

  /**
   * findManagers
   * Finds the relevant managers based on the query given
   */
  public async findManagers(
    query?: string,
    top: number = 1000,
    skip: number = 0
  ): Promise<UserEntity[]> {
    const statement = SELECT.from(User)
      .where(`isManager = true ${query ? `AND (${query})` : ""}`)
      .limit(top, skip);

    return await this.srv.run(statement);
  }
}
