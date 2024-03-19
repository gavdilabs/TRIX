import cds from "@sap/cds";
import { expect } from "chai";

describe("getRecordStatuses Tests", () => {
  const service = cds.test(`${__dirname}/../..`);
  const expectedValues = new Map<string, number>([
    ["Awaiting", 0],
    ["Processing", 1],
    ["Complete", 2],
    ["Error", 3],
  ]);

  it("Should return all required record statuses", async () => {
    const result = await service.GET("/odata/v4/core/getRecordStatuses()", {
      auth: {
        username: "TIM",
        password: "tim1234",
      },
    });

    expect(result.status).to.equal(200);

    const data: { value: { name: string; index: number }[] } = result.data;
    expect(data.value).to.not.be.undefined;
    expect(data.value.length).to.equal(4);

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
      await service.GET("/odata/v4/core/getRecordStatuses()");
    } catch (e) {
      expect(e).to.not.be.undefined;
      expect((e as any)["response"]["status"]).to.equal(401);
    }
  });
});
