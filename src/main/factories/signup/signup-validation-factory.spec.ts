import {
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite,
} from "../../../presentation/helpers/validators";
import { Validation } from "../../../presentation/protocols/validation";
import { makeSignupValidation } from "./signup-validation-factory";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";

jest.mock("../../../presentation/helpers/validators/validation-composite");

describe("SignupValidation factory", () => {
  test("should call ValidationComposite with all validations", () => {
    makeSignupValidation();
    const requiredFields = [
      "name",
      "email",
      "password",
      "passwordConfirmation",
    ];

    const equalFields = [
      { fieldName: "password", fieldToCompareName: "passwordConfirmation" },
    ];
    const validations: Validation[] = [];

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }

    for (const { fieldName, fieldToCompareName } of equalFields) {
      validations.push(
        new CompareFieldsValidation(fieldName, fieldToCompareName)
      );
    }

    validations.push(new EmailValidation(new EmailValidatorAdapter()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
