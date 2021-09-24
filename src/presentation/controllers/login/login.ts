import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { MissingParamError } from "../../errors";
import { badRequest, ok } from "../../helpers/http-helper";

export class LoginController implements Controller {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return new Promise((resolve) =>
        resolve(badRequest(new MissingParamError("email")))
      );
    }
    if (!httpRequest.body.password) {
      return new Promise((resolve) =>
        resolve(badRequest(new MissingParamError("password")))
      );
    }
    return new Promise((resolve) => resolve(ok("ok")));
  }
}
