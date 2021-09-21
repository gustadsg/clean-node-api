// eslint-disable-next-line import/no-extraneous-dependencies
import request from "supertest";
import app from "../config/app";

describe("Signup Routes", () => {
  test("should return 200 on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Gustavo",
        email: "gustavo@email.com",
        password: "senha123",
        passwordConfirmation: "senha123",
      })
      .expect(200);
  });
});
