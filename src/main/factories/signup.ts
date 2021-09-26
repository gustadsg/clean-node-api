import { SignUpController } from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";

export const makeSignUpController = (): Controller => {
  const saltRounds = 12;
  const bcryptAdapter = new BcryptAdapter(saltRounds);
  const emailValidator = new EmailValidatorAdapter();
  const validationComposite = new ValidationComposite([
    new RequiredFieldValidation("name"),
  ]);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    emailValidator,
    dbAddAccount,
    validationComposite
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
