import { User as UserEntity } from "../utils/entities/trix/core";
import {
  Inject,
  Repository,
  Service,
  SRV,
} from "@dxfrontier/cds-ts-dispatcher";
import cds from "@sap/cds";

const { User } = cds.entities;

@Repository()
export default class UserRepository {
  @Inject(SRV)
  private srv: Service;

  constructor() {}

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

  public async findUser(id: string): Promise<UserEntity> {
    const query = SELECT.from(User).byKey(id);
    return await cds.run(query);
  }

  public async create(data: Partial<UserEntity>): Promise<void> {
    const query = INSERT.into(User).entries([data]);
    return await cds.run(query);
  }
}
