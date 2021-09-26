import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { makeSignupValidation } from "./signup-validation";

jest.mock("../../presentation/helpers/validators/validation-composite");

describe("SignupValidation factory", () => {
  test("should call ValidationComposite with all validations", () => {
    makeSignupValidation();
    const requiredFields = [
      "name",
      "email",
      "password",
      "passwordConfirmation",
    ];
    const validations: Validation[] = [];

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
