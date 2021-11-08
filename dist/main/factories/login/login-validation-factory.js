"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginValidation = void 0;
const validators_1 = require("../../../presentation/helpers/validators");
const email_validator_adapter_1 = require("../../adapters/validators/email-validator-adapter");
const makeLoginValidation = () => {
    const requiredFields = ["email", "password"];
    const validations = [];
    for (const field of requiredFields) {
        validations.push(new validators_1.RequiredFieldValidation(field));
    }
    validations.push(new validators_1.EmailValidation(new email_validator_adapter_1.EmailValidatorAdapter()));
    const validationComposite = new validators_1.ValidationComposite(validations);
    return validationComposite;
};
exports.makeLoginValidation = makeLoginValidation;
