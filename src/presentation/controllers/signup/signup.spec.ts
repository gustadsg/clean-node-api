/* eslint-disable max-classes-per-file */
import { SignUpController } from "./signup";
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from "../../errors";
import {
  EmailValidator,
  AddAccountModel,
  AddAccount,
  AccountModel,
  HttpRequest,
  Validation,
} from "./signup-protocols";
import { created, serverError, badRequest } from "../../helpers/http-helper";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
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
  email: "valid_email@email.com",
  password: "valid_password",
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(email: string): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub
  );

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        // name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
  });

  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        // email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        // password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("should return 400 if no password confirmation is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        // passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("passwordConfirmation"))
    );
  });

  test("should return 400 if password confirmation fails", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "invalid_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("passwordConfirmation"))
    );
  });

  test("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("should call email validator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest
      .spyOn(emailValidatorStub, "isValid")
      .mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("should return 500 if email validator throws", async () => {
    const { emailValidatorStub, sut } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isValid")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation((email: string) => {
        throw new Error();
      });

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test("should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, "add");

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
  });

  test("should return 500 if add account throws", async () => {
    const { addAccountStub, sut } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (account: AddAccountModel) =>
        new Promise((_, reject) => reject(new Error()))
    );

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test("should return 201 if valid data is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(created(makeFakeAccount()));
  });

  test("should call validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
