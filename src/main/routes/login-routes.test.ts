/* eslint-disable import/no-extraneous-dependencies */
import request from "supertest";
import faker from "faker";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mogo-helper";
import app from "../config/app";

describe("Login Routes", () => {
  beforeAll(async () => {
    const mongoURL = process.env.MONGO_URL || "";
    await MongoHelper.connect(mongoURL);
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getConnection("accounts");
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
});
