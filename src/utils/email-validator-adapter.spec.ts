import validator from "validator";
import { EmailValidatorAdapter } from "./email-validator";

jest.mock("validator", () => ({
  isEmail: (): boolean => true,
}));

describe("EmailValidator adapter", () => {
  test("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@mail.com");

    expect(isValid).toBe(false);
  });

  test("should return true if validator returns true", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("valid_email@mail.com");

    expect(isValid).toBe(true);
  });

  test("should call validator with correct email", () => {
    const sut = new EmailValidatorAdapter();

    const isEmailSpy = jest.spyOn(validator, "isEmail");

    sut.isValid("any_email@mail.com");

    expect(isEmailSpy).toBeCalledWith("any_email@mail.com");
  });
});
