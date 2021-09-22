import { MongoHelper as sut } from "./mogo-helper";

describe("Mongo Helper", () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL || "");
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test("should recconect if mongo db is down", async () => {
    let accountCollection = await sut.getConnection("accounts");
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getConnection("accounts");
    expect(accountCollection).toBeTruthy();
  });
});
