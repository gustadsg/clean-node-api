import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok } from "../../helpers/http-helper";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body;

    if (!email) {
      return new Promise((resolve) =>
        resolve(badRequest(new MissingParamError("email")))
      );
    }
    if (!password) {
      return new Promise((resolve) =>
        resolve(badRequest(new MissingParamError("password")))
      );
    }

    const isValid = this.emailValidator.isValid(email);

    if (!isValid) {
      return new Promise((resolve) =>
        resolve(badRequest(new InvalidParamError("email")))
      );
    }

    return new Promise((resolve) => resolve(ok("ok")));
  }
}
