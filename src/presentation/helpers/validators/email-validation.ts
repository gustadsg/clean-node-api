import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";
import { EmailValidator } from "../../protocols/email-validator";

export class EmailValidation implements Validation {
  constructor(private readonly emailValidator: EmailValidator) {}

  validate(input: any): Error | null {
    if (!this.emailValidator.isValid(input.email)) {
      return new InvalidParamError("email");
    }
    return null;
  }
}
