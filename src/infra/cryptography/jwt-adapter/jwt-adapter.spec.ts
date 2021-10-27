// eslint-disable-next-line import/no-extraneous-dependencies
import { random } from "faker";
import Jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

const randomToken = random.alphaNumeric(64);
const randomId = random.alphaNumeric(32);
const randomSecret = random.alphaNumeric(32);

jest.mock("jsonwebtoken", () => ({
  sign: async () => new Promise((resolve) => resolve(randomToken)),
}));

describe("Jwt Adapter", () => {
  test("Should call sign with correct values", async () => {
    const sut = new JwtAdapter(randomSecret);
    const signSpy = jest.spyOn(Jwt, "sign");
    await sut.encrypt(randomId);
    expect(signSpy).toHaveBeenCalledWith({ id: randomId }, randomSecret);
  });

  test("Should return a token on sign success", async () => {
    const sut = new JwtAdapter(randomSecret);
    const accessToken = await sut.encrypt(randomId);
    expect(accessToken).toBe(randomToken);
  });
});
