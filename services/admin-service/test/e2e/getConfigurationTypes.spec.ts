import cds from "@sap/cds";
import { expect } from "chai";

describe("getValidationTypes Tests", () => {
  const service = cds.test(`${__dirname}/../..`);
  const expectedValues = new Map<string, number>([
    ["None", 0],
    ["ElevenHourRule", 1],
    ["FourtyEightHourRule", 3],
    ["AbsenceInWorkHours", 4],
  ]);

  it("Should return all required types", async () => {
    const result = await service.GET("/odata/v4/core/getValidationTypes()", {
      auth: {
        username: "ADM",
        password: "adm1234",
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
      await service.GET("/odata/v4/core/getValidationTypes()");
    } catch (e) {
      expect(e).to.not.be.undefined;
      expect((e as any)["response"]["status"]).to.equal(401);
    }
  });

  it("Should deny data if the user is not admin", async () => {
    try {
      await service.GET("/odata/v4/core/getValidationTypes()", {
        auth: {
          username: "MGR",
          password: "mgr1234",
        },
      });
    } catch (e) {
      expect(e).to.not.be.undefined;
      expect((e as any)["response"]["status"]).to.equal(401);
    }
  });
});
