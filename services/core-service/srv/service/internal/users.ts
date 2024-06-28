import { Inject } from "@dxfrontier/cds-ts-dispatcher";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import UserRepository from "../../repository/UserRepo";
import { UserSet } from "../../utils/entities/TrixCoreService";
import XsuaaService from "../xsuaa/service";

export default class UserService {
  private logger: Logger;

  @Inject(XsuaaService)
  private xsuaa: XsuaaService;

  @Inject(UserRepository)
  private userRepo: UserRepository;

  constructor() {
    this.logger = LoggerFactory.createLogger("user-srv");
  }

  public async getUserOrGenerate(userId: string): Promise<UserSet | undefined> {
    const storedUser = await this.userRepo.findOne({ userID: userId });
    if (storedUser) return storedUser;

    const xsuaaUser = await this.xsuaa.getUser(userId);
    if (!xsuaaUser) return undefined; // No user found, we can't do any more

    const activeEmail =
      xsuaaUser.emails.filter((el) => el.primary)[0] ?? xsuaaUser.emails[0];
    const user: UserSet = {
      userID: userId,
      email: activeEmail?.value,
      firstName: xsuaaUser.name.givenName,
      lastName: xsuaaUser.name.familyName,
    };

    const result = await this.userRepo.create(user);
    return result.query.INSERT.entries.length <= 0 ? undefined : user;
  }
}
