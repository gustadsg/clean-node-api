import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  encrypterStub: Encrypter;
  sut: DbAddAccount;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub);
  return {
    encrypterStub,
    sut,
  };
};

describe("DbAddAccount UseCase", () => {
  test("should call Encrypter with correct password", async () => {
    const { encrypterStub, sut } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    const accountData = {
      name: "valid_name",
      email: "valid_eamil",
      password: "valid_password",
    };
    sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
});
