"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginController = void 0;
const env_1 = __importDefault(require("../../config/env"));
const log_controller_decorator_1 = require("../../decorators/log-controller-decorator");
const login_validation_factory_1 = require("./login-validation-factory");
const db_authentication_1 = require("../../../data/usecases/authentication/db-authentication");
const login_controller_1 = require("../../../presentation/controllers/login/login-controller");
const log_mongo_repository_1 = require("../../../infra/db/mongodb/log/log-mongo-repository");
const account_mongo_repository_1 = require("../../../infra/db/mongodb/account/account-mongo-repository");
const bcrypt_adapter_1 = require("../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter");
const jwt_adapter_1 = require("../../../infra/cryptography/jwt-adapter/jwt-adapter");
const makeLoginController = () => {
    const salt = 12;
    const bcryptAdapter = new bcrypt_adapter_1.BcryptAdapter(salt);
    const jwtAdapter = new jwt_adapter_1.JwtAdapter(env_1.default.jwtSecret);
    const accountMongoRepository = new account_mongo_repository_1.AccountMongoRepository();
    const dbAuthentication = new db_authentication_1.DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
    const loginController = new login_controller_1.LoginController(dbAuthentication, (0, login_validation_factory_1.makeLoginValidation)());
    const logMongoRepository = new log_mongo_repository_1.LogMongoRepository();
    return new log_controller_decorator_1.LogControllerDecorator(loginController, logMongoRepository);
};
exports.makeLoginController = makeLoginController;
