"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignupValidation = void 0;
const validators_1 = require("../../../presentation/helpers/validators");
const email_validator_adapter_1 = require("../../adapters/validators/email-validator-adapter");
const makeSignupValidation = () => {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    const equalFields = [
        { fieldName: "password", fieldToCompareName: "passwordConfirmation" },
    ];
    const validations = [];
    for (const field of requiredFields) {
        validations.push(new validators_1.RequiredFieldValidation(field));
    }
    for (const { fieldName, fieldToCompareName } of equalFields) {
        validations.push(new validators_1.CompareFieldsValidation(fieldName, fieldToCompareName));
    }
    validations.push(new validators_1.EmailValidation(new email_validator_adapter_1.EmailValidatorAdapter()));
    const validationComposite = new validators_1.ValidationComposite(validations);
    return validationComposite;
};
exports.makeSignupValidation = makeSignupValidation;
