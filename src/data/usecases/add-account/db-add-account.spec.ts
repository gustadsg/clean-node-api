/* eslint-disable max-classes-per-file */
import {
  AddAccountModel,
  Hasher,
  AccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  hasherStub: Hasher;
  sut: DbAddAccount;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  ...makeFakeAccountData(),
});

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);
  return {
    addAccountRepositoryStub,
    hasherStub,
    sut,
  };
};

describe("DbAddAccount UseCase", () => {
  test("should call Hasher with correct password", async () => {
    const { hasherStub, sut } = makeSut();

    const hashSpy = jest.spyOn(hasherStub, "hash");

    const accountData = makeFakeAccountData();
    sut.add(accountData);

    expect(hashSpy).toHaveBeenCalledWith("valid_password");
  });

  test("should throw if hasher throws", async () => {
    const { hasherStub, sut } = makeSut();

    jest
      .spyOn(hasherStub, "hash")
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const accountData = makeFakeAccountData();

    const promise = sut.add(accountData);

    expect(promise).rejects.toThrow();
  });

  test("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

    const accountData = makeFakeAccountData();

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("should throw if AddAccountRepository throws", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();

    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const accountData = makeFakeAccountData();

    const promise = sut.add(accountData);

    expect(promise).rejects.toThrow();
  });

  test("should return an account on success", async () => {
    const { sut } = makeSut();

    const accountData = makeFakeAccountData();

    const account = await sut.add(accountData);

    expect(account).toEqual(makeFakeAccount());
  });
});
