/* eslint-disable max-classes-per-file */

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";
import {
  serverError,
  created,
} from "../../presentation/helpers/http/http-helper";
import { LogErrorRepository } from "../../data/protocols/db/log-error-repository";
import { AccountModel } from "../../domain/models/account";

interface SutTypes {
  controllerStub: Controller;
  sut: LogControllerDecorator;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(created(makeFakeAccount())));
    }
  }

  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    // eslint-disable-next-line
    async logError(stack: string): Promise<void> {}
  }
  return new LogErrorRepositoryStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return { controllerStub, sut, logErrorRepositoryStub };
};

describe("LogController Decorator", () => {
  test("should call controller handle method with correct values", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(handleSpy).toBeCalledWith(httpRequest);
  });

  test("should return the same result of the controller handle method", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const sutResponse = await sut.handle(httpRequest);

    expect(sutResponse).toEqual(created(makeFakeAccount()));
  });

  test("should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");

    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError()))
      );
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(logSpy).toBeCalledWith("any_stack");
  });
});
