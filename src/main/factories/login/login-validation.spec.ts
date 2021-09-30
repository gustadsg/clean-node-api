import {
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
} from "../../../presentation/helpers/validators";
import { Validation } from "../../../presentation/protocols/validation";
import { makeLoginValidation } from "./login-validation";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";

jest.mock("../../../presentation/helpers/validators/validation-composite");

describe("LoginValidation factory", () => {
  test("should call ValidationComposite with all validations", () => {
    makeLoginValidation();
    const requiredFields = ["email", "password"];

    const validations: Validation[] = [];

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation(new EmailValidatorAdapter()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
