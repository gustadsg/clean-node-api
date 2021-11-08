"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const http_helper_1 = require("../../helpers/http/http-helper");
class LoginController {
    constructor(authentication, validation) {
        this.authentication = authentication;
        this.validation = validation;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return (0, http_helper_1.badRequest)(error);
            }
            const { email, password } = httpRequest.body;
            const accessToken = await this.authentication.auth({ email, password });
            if (!accessToken) {
                return (0, http_helper_1.unauthorized)();
            }
            return (0, http_helper_1.ok)({ accessToken });
        }
        catch (error) {
            if (error instanceof Error) {
                return (0, http_helper_1.serverError)(error);
            }
            return (0, http_helper_1.serverError)();
        }
    }
}
exports.LoginController = LoginController;
