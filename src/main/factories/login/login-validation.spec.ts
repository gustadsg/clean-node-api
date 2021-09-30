import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../../presentation/protocols/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { makeLoginValidation } from "./login-validation";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
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
