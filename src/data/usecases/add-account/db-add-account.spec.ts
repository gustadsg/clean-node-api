/* eslint-disable max-classes-per-file */
import {
  AddAccountModel,
  Encrypter,
  AccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  encrypterStub: Encrypter;
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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new EncrypterStub();
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
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    addAccountRepositoryStub,
    encrypterStub,
    sut,
  };
};

describe("DbAddAccount UseCase", () => {
  test("should call Encrypter with correct password", async () => {
    const { encrypterStub, sut } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    const accountData = makeFakeAccountData();
    sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  test("should throw if encrypter throws", async () => {
    const { encrypterStub, sut } = makeSut();

    jest
      .spyOn(encrypterStub, "encrypt")
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
