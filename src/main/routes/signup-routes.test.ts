// eslint-disable-next-line import/no-extraneous-dependencies
import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mogo-helper";
import app from "../config/app";

describe("Signup Routes", () => {
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

  test("should return 200 on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Gustavo",
        email: "gustavo@email.com",
        password: "senha123",
        passwordConfirmation: "senha123",
      })
      .expect(201);
  });
});
