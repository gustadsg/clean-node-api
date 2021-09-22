import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

class ControllerStub implements Controller {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: { name: "gustavo" },
    };
    return new Promise((resolve) => resolve(httpResponse));
  }
}

describe("LogController Decorator", () => {
  test("should call controller handle method with correct values", async () => {
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const sut = new LogControllerDecorator(controllerStub);

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    await sut.handle(httpRequest);
    expect(handleSpy).toBeCalledWith(httpRequest);
  });
});
