import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../presentation/helpers/validators";
import { Validation } from "../../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../adapters/validators/email-validator-adapter";

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
