import { Router } from "express";
import { makeSignUpController } from "../factories/signup/signup-factory";
import { adaptRoute } from "../adapters/express/express-route-adapter";

export default (router: Router): void => {
  const signupController = makeSignUpController();
  router.post("/signup", adaptRoute(signupController));
};
