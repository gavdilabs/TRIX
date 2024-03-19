import cds from "@sap/cds";
import { expect } from "chai";

describe("getRegistrationTypes Tests", () => {
  const service = cds.test(`${__dirname}/../..`);
  const expectedValues = new Map<string, number>([
    ["Manual", 0],
    ["ClockInOut", 1],
  ]);

  it("Should return all required registration types", async () => {
    const result = await service.GET("/odata/v4/core/getRegistrationTypes()", {
      auth: {
        username: "TIM",
        password: "tim1234",
      },
    });

    expect(result.status).to.equal(200);

    const data: { value: { name: string; index: number }[] } = result.data;
    expect(data.value).to.not.be.undefined;
    expect(data.value.length).to.equal(2);

    const dataMap = new Map<string, number>(
      data.value.map((el) => [el.name, el.index])
    );

    for (const [expectedKey, expectedValue] of expectedValues) {
      const resultEntry = dataMap.get(expectedKey);
      expect(resultEntry).to.not.be.undefined;
      expect(resultEntry).to.equal(expectedValue);
    }
  });

  it("Should deny data if the user is not authenticated", async () => {
    try {
      await service.GET("/odata/v4/core/getRegistrationTypes()");
    } catch (e) {
      expect(e).to.not.be.undefined;
      expect((e as any)["response"]["status"]).to.equal(401);
    }
  });
});
