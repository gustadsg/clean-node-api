/* eslint-disable import/no-extraneous-dependencies */
import faker from "faker";
import { InvalidParamError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";
import { EmailValidation } from "./email-validation";

interface SutTypes {
  emailValidatorStub: EmailValidator;
  sut: EmailValidation;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation(emailValidatorStub);

  return {
    emailValidatorStub,
    sut,
  };
};

describe("EmailValidation", () => {
  test("should call EmailValidator with correct value", () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const email = faker.internet.email();

    sut.validate({ email });

    expect(isValidSpy).toHaveBeenCalledWith(email);
  });

  test("should return an error if an invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const email = faker.internet.email();

    const error = sut.validate({ email });

    expect(error).toEqual(new InvalidParamError("email"));
  });
});
