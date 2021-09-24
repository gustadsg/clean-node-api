import { Collection, Document } from "mongodb";
import { MongoHelper } from "../helpers/mogo-helper";
import { LogMongoRepository } from "./log";

const makeSut = (): LogMongoRepository => new LogMongoRepository();

describe("Log Mońgo Repository", () => {
  let errorCollection: Collection<Document> | null;

  beforeAll(async () => {
    const mongoURL = process.env.MONGO_URL || "";
    await MongoHelper.connect(mongoURL);
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getConnection("errors");
    await errorCollection?.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("should create an error log on success", async () => {
    const sut = makeSut();

    await sut.logError("any_error");
    const count = await errorCollection?.countDocuments();
    expect(count).toBe(1);
  });
});
