/* eslint-disable max-classes-per-file */
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from "faker";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/cryptography/hash-comparer";
import { TokenGenerator } from "../../protocols/cryptography/token-generator";

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
}

const makeFakeAccount = (): AccountModel => ({
  id: faker.random.word(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

const loadedAccount = makeFakeAccount();

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async load(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(loadedAccount));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparerStub();
};

const generatedToken = faker.datatype.string(64);
const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve(generatedToken));
    }
  }
  return new TokenGeneratorStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  );

  return {
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    sut,
  };
};

describe("DbAuthentication Usecase", () => {
  test("should call LoadAccountByEmailRepository with correct email", () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    const payload = makeFakeAuthentication();

    sut.auth(payload);
    expect(loadSpy).toHaveBeenCalledWith(payload.email);
  });

  test("should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    const payload = makeFakeAuthentication();
    await sut.auth(payload);

    expect(compareSpy).toHaveBeenCalledWith(
      payload.password,
      loadedAccount.password
    );
  });

  test("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call TokenGenerator with correct id", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, "generate");
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith(loadedAccount.id);
  });

  test("should throw if TokenGenerator throws", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  test("should return an access token on success", async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe(generatedToken);
  });
});
