import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { Controller, HttpRequest } from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;

  private readonly logErrorRepository: LogErrorRepository | null = null;

  constructor(controller: Controller, logErrorRepository?: LogErrorRepository) {
    this.controller = controller;
    if (logErrorRepository) {
      this.logErrorRepository = logErrorRepository;
    }
  }

  async handle(httpRequest: HttpRequest) {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500 && this.logErrorRepository) {
      this.logErrorRepository.log(httpResponse.body.stack);
    }
    return httpResponse;
  }
}