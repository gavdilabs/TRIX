import cds from "@sap/cds";
import { expect } from "chai";
import UserRepository from "../../../srv/repository/UserRepo";

describe("UserRepository Tests", () => {
  const service = cds.test(`${__dirname}/../../..`);
  const repo = new UserRepository();

  it("Should be possible to find Users", async () => {
    // const data = (await repo.find()) as [];
    // expect(data).to.not.be.undefined;
    // expect(data.length).to.be.greaterThanOrEqual(10);
  });

  it("Should be possible to find a User based on ID", async () => {});

  it("Should be possible to find Managers", async () => {});

  it("Should be possible to create Users", async () => {});

  it("Should be possible to update Users", async () => {});

  it("Should be possible to delete Users", async () => {});
});
