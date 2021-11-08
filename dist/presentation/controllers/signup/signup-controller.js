"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpController = void 0;
const http_helper_1 = require("../../helpers/http/http-helper");
class SignUpController {
    constructor(addAccount, validation) {
        this.addAccount = addAccount;
        this.validation = validation;
    }
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return (0, http_helper_1.badRequest)(error);
            }
            const { name, email, password } = httpRequest.body;
            const account = await this.addAccount.add({
                name,
                email,
                password,
            });
            return (0, http_helper_1.created)(account);
        }
        catch (error) {
            if (error instanceof Error) {
                return (0, http_helper_1.serverError)(error);
            }
            return (0, http_helper_1.serverError)();
        }
    }
}
exports.SignUpController = SignUpController;
