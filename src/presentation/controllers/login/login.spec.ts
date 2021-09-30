/* eslint-disable max-classes-per-file */
import { LoginController } from "./login";
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "../../helpers/http/http-helper";
import { InvalidParamError, MissingParamError } from "../../errors";
import {
  HttpRequest,
  Authentication,
  Validation,
  AuthenticationModel,
} from "./login-protocols";

interface SutTypes {
  sut: LoginController;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate() {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async auth(authentication: AuthenticationModel): Promise<string> {
      return "any_token";
    }
  }

  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new LoginController(authenticationStub, validationStub);

  return { sut, validationStub, authenticationStub };
};

describe("Login Controller", () => {
  test("should return 400 if no email is provided", async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("email"));

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("should return 400 if no password is provided", async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = {
      body: {
        email: "any_mail@mail.com",
      },
    };

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("password"));

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("should return 400 if an invalid email is provided", async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new InvalidParamError("email"));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("should return 500 if email validator throws", async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test("should return 500 if authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, "auth").mockImplementation(async () => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });

  test("should call validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
