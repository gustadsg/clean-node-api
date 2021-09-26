import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";

export const makeSignupValidation = (): Validation => {
  const requiredFields = ["name", "email", "password", "passwordConfirmation"];
  const validations: Validation[] = [];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
