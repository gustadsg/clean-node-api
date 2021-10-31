import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { Controller } from "../../../presentation/protocols/controller";
import { makeSignupValidation } from "./signup-validation-factory";

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
