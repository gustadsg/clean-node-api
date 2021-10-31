/* eslint-disable import/no-extraneous-dependencies */
import request from "supertest";
import faker from "faker";
import { Collection } from "mongodb";
import { hash } from "bcrypt";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mogo-helper";
import app from "../config/app";

let accountCollection: Collection | null;

describe("Login Routes", () => {
  beforeAll(async () => {
    const mongoURL = process.env.MONGO_URL || "";
    await MongoHelper.connect(mongoURL);
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getConnection("accounts");
    await accountCollection?.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe("POST /signup", () => {
    test("should return 200 on signup success", async () => {
      const fakerPass = faker.internet.password();

      await request(app)
        .post("/api/signup")
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: fakerPass,
          passwordConfirmation: fakerPass,
        })
        .expect(201);
    });
  });

  describe("POST /login", () => {
    test("should return 200 on login success", async () => {
      const userInfo = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await accountCollection?.insertOne({
        ...userInfo,
        password: await hash(userInfo.password, 12),
      });

      await request(app)
        .post("/api/login")
        .send({ email: userInfo.email, password: userInfo.password })
        .expect(200);
    });

    test("should return 401 on invalid login credentials", async () => {
      const userInfo = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app)
        .post("/api/login")
        .send({ email: userInfo.email, password: userInfo.password })
        .expect(401);
    });
  });
});
