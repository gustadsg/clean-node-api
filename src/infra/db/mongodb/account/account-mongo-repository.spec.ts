// eslint-disable-next-line import/no-extraneous-dependencies
import faker from "faker";
import { Collection, Document } from "mongodb";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helpers/mogo-helper";
import { AccountMongoRepository } from "./account-mongo-repository";

const accountData = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const randomToken = faker.random.alphaNumeric(64);

let accountCollection: Collection<Document> | null;

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    const mongoURL = process.env.MONGO_URL || "";
    await MongoHelper.connect(mongoURL);
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getConnection("accounts");
    await accountCollection?.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

  test("should  return an account on add success", async () => {
    const sut = makeSut();

    const account = await sut.add(accountData);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account?.name).toBe(accountData.name);
    expect(account?.email).toBe(accountData.email);
    expect(account?.password).toBe(accountData.password);
  });

  test("should  return an account on loadByEmail success", async () => {
    const sut = makeSut();

    await accountCollection?.insertOne(accountData);

    const account = await sut.loadByEmail(accountData.email);

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe(accountData.name);
    expect(account?.email).toBe(accountData.email);
    expect(account?.password).toBe(accountData.password);
  });

  test("should  return null if loadByEmail fails", async () => {
    const sut = makeSut();

    const account = await sut.loadByEmail(accountData.email);

    expect(account).toBeFalsy();
  });

  test("should update the account accesTken on updateAccessToken success", async () => {
    const sut = makeSut();

    let account: Document | null = null;

    const result = await accountCollection?.insertOne(accountData);
    const insertedId = result?.insertedId;

    if (insertedId) {
      await sut.updateAccessToken(insertedId.id.toString("hex"), randomToken);
      const foundObj = await accountCollection?.findOne<AccountModel>({
        _id: insertedId,
      });

      if (!(foundObj === undefined)) {
        account = foundObj;
      }
    }

    expect(account).toBeTruthy();
    expect(account?.accessToken).toBe(randomToken);
  });
});
