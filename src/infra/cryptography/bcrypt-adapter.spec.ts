import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

const saltRounds = 12;

const makeSut = (): BcryptAdapter => new BcryptAdapter(saltRounds);

describe("BcryptAdapter", () => {
  test("should call bcrypt with correcct values", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", saltRounds);
  });

  test("should throw if bcrypt throws", async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(
        async () => new Promise((_, reject) => reject(new Error()))
      );
    const promise = sut.encrypt("anu_value");

    await expect(promise).rejects.toThrow();
  });

  test("should return a hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });
});
