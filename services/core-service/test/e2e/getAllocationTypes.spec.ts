import cds from "@sap/cds";
import { expect } from "chai";

describe("getAllocationTypes Tests", () => {
  const service = cds.test(`${__dirname}/../..`);
  const expectedValues = new Set<string>([
    "Project",
    "Service",
    "AbsenceAttendance",
  ]);

  it("Should return all required record statuses", async () => {
    const result = await service.GET("/odata/v4/core/getAllocationTypes()", {
      auth: {
        username: "TIM",
        password: "tim1234",
      },
    });

    expect(result.status).to.equal(200);

    const data: { value: string[] } = result.data;
    expect(data.value).to.not.be.undefined;
    expect(data.value.length).to.equal(3);

    const dataSet = new Set<string>(data.value);
    for (const expected of expectedValues) {
      expect(dataSet.has(expected)).to.equal(true);
    }
  });

  it("Should deny data if the user is not authenticated", async () => {
    try {
      await service.GET("/odata/v4/core/getAllocationTypes()");
    } catch (e) {
      expect(e).to.not.be.undefined;
      expect((e as any)["response"]["status"]).to.equal(401);
    }
  });
});
