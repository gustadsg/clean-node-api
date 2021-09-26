import { CompareFieldsValidation } from "../../presentation/helpers/validators/compare-fields-validation";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";

export const makeSignupValidation = (): Validation => {
  const requiredFields = ["name", "email", "password", "passwordConfirmation"];
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

  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
