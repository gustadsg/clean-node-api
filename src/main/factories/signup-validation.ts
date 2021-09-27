import { CompareFieldsValidation } from "../../presentation/helpers/validators/compare-fields-validation";
import { EmailValidation } from "../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

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

  validations.push(new EmailValidation(new EmailValidatorAdapter()));

  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
