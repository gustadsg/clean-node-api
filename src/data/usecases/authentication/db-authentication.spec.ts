// eslint-disable-next-line import/no-extraneous-dependencies
import faker from "faker";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

describe("DbAuthentication Usecase", () => {
  test("should call LoadAccountByEmailRepository with correct email", () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async load(email: string): Promise<AccountModel> {
        const account = {
          id: "any_id",
          name: "any_name",
          email: "any_email@mail.com",
          password: "any_password",
        };
        return new Promise((resolve) => resolve(account));
      }
    }
    const loadAccountByEmailRepositoryStub =
      new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    const payload = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    sut.auth(payload);
    expect(loadSpy).toHaveBeenCalledWith(payload.email);
  });
});
