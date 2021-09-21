// eslint-disable-next-line import/no-extraneous-dependencies
import request from "supertest";
import app from "../config/app";

describe("CORES Middleware", () => {
  test("should enable", async () => {
    app.get("/test_cors", (_, res) => res.send());

    await request(app)
      .get("/test_body_parser")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-methods", "*")
      .expect("access-control-allow-headers", "*");
  });
});
