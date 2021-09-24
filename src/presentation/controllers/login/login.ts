import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";

export class LoginController implements Controller {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve) =>
      resolve(badRequest(new MissingParamError("email")))
    );
  }
}
