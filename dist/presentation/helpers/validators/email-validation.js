"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidation = void 0;
const errors_1 = require("../../errors");
class EmailValidation {
    constructor(emailValidator) {
        this.emailValidator = emailValidator;
    }
    validate(input) {
        if (!this.emailValidator.isValid(input.email)) {
            return new errors_1.InvalidParamError("email");
        }
        return null;
    }
}
exports.EmailValidation = EmailValidation;
