import { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";

export const makeSignupValidation = (): Validation => {
  const validationComposite = new ValidationComposite([]);
  return validationComposite;
};
