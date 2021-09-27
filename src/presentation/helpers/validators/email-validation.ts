import { InvalidParamError } from "../../errors";
import { Validation } from "./validation";
import { EmailValidator } from "../../protocols/email-validator";

export class EmailValidation implements Validation {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  validate(input: any): Error | null {
    if (!this.emailValidator.isValid(input.email)) {
      return new InvalidParamError("email");
    }
    return null;
  }
}
