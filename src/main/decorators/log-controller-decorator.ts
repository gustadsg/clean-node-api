import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository";
import { Controller, HttpRequest } from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(httpRequest: HttpRequest) {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500 && this.logErrorRepository) {
      this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
