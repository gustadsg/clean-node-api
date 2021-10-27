import { SignUpController } from "../../../presentation/controllers/signup/signup";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account";
import { LogMongoRepository } from "../../../infra/db/mongodb/log-repository/log";
import { LogControllerDecorator } from "../../decorators/log";
import { Controller } from "../../../presentation/protocols/controller";
import { makeSignupValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
  const saltRounds = 12;
  const bcryptAdapter = new BcryptAdapter(saltRounds);
  const validationComposite = makeSignupValidation();
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    dbAddAccount,
    validationComposite
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
