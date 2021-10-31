import {
  badRequest,
  serverError,
  created,
} from "../../helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
} from "./signup-controller-protocols";

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return created(account);
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error);
      }
      return serverError();
    }
  }
}
