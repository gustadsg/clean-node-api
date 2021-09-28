import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation";
import { Validation } from "../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { makeSignupValidation } from "./signup-validation";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
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
