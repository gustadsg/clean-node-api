import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

describe("BcryptAdapter", () => {
  test("should call bcrypt with correcct values", async () => {
    const saltRounds = 12;
    const sut = new BcryptAdapter(saltRounds);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", saltRounds);
  });
  test("should return a hash on success", async () => {
    const saltRounds = 12;
    const sut = new BcryptAdapter(saltRounds);
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });
});
