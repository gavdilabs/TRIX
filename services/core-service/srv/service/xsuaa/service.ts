import { RestService } from "@gavdi/cap-service-core";
import {
  constructGroupListQuery,
  constructGroupMemberListQuery,
  constructGroupMemberQuery,
  constructGroupQuery,
  constructUserListQuery,
  constructUserQuery,
  USER_URI,
} from "./requests";
import {
  XsuaaUser,
  QueryParams,
  XsuaaUserCreate,
  XsuaaGroupMemberList,
  XsuaaUserList,
  XsuaaGroup,
  XsuaaGroupList,
  XsuaaGroupMember,
} from "./types";
import { ServiceLogic } from "@dxfrontier/cds-ts-dispatcher";

@ServiceLogic()
export default class XsuaaService extends RestService {
  constructor() {
    super("xsuaa-api");
  }

  public async getUser(id: string): Promise<XsuaaUser | undefined> {
    const query = constructUserQuery(id);
    if (!this.GetConnection()) {
      await this.verifyConnection();
    }

    return await this.GetConnection()?.get(query);
  }

  public async getUserList(
    params?: QueryParams
  ): Promise<XsuaaUserList | undefined> {
    const query = constructUserListQuery(params);
    if (!this.GetConnection()) {
      await this.verifyConnection();
    }

    return await this.GetConnection()?.get(query);
  }

  public async createUser(
    data: XsuaaUserCreate
  ): Promise<XsuaaUser | undefined> {
    if (!this.GetConnection()) {
      await this.verifyConnection();
    }

    return await this.GetConnection()?.post(USER_URI, data);
  }

  public async updateUser(
    id: string,
    data: Partial<XsuaaUser>
  ): Promise<XsuaaUser | undefined> {
    const query = constructUserQuery(id);
    if (!this.GetConnection()) {
      await this.verifyConnection();
    }

    return await this.GetConnection()?.put(query, data);
  }

  public async deleteUser(id: string): Promise<void> {
    const query = constructUserQuery(id);
    if (!this.GetConnection()) {
      await this.verifyConnection();
    }

    return await this.GetConnection()?.delete(query);
  }

  public async getGroup(id: string): Promise<XsuaaGroup | undefined> {
    const query = constructGroupQuery(id);
    if (!this.GetConnection()) {
      await this.verifyConnection();
    }

    return await this.GetConnection()?.get(query);
  }

  public async getGroupList(
    params?: QueryParams
  ): Promise<XsuaaGroupList | undefined> {
    const query = constructGroupListQuery(params);
    if (!this.GetConnection()) {
      await this.verifyConnection();
    }

    return await this.GetConnection()?.get(query);
  }

  public async getGroupMembers(
    id: string
  ): Promise<XsuaaGroupMemberList | undefined> {
    const query = constructGroupMemberListQuery(id);
    if (!this.GetConnection()) {
      await this.verifyConnection();
    }

    return await this.GetConnection()?.get(query);
  }

  public async getGroupMemberById(
    group: string,
    userId: string
  ): Promise<XsuaaGroupMember | undefined> {
    const query = constructGroupMemberQuery(group, userId);
    if (!this.GetConnection()) {
      await this.verifyConnection();
    }

    return await this.GetConnection()?.get(query);
  }

  private async verifyConnection(): Promise<void> {
    await this.Connect().then(() => {
      this.serviceConnection;
      if (!this.GetConnection())
        throw new Error("Failed to connect to remote service");
    });
  }
}
