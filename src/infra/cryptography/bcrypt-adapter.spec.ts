import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const saltRounds = 12;

const makeSut = (): BcryptAdapter => new BcryptAdapter(saltRounds);

describe("BcryptAdapter", () => {
  test("should call hash with correcct values", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", saltRounds);
  });

  test("should throw if hash throws", async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(
        async () => new Promise((_, reject) => reject(new Error()))
      );
    const promise = sut.hash("anu_value");

    await expect(promise).rejects.toThrow();
  });

  test("should return a valid hash on hash success", async () => {
    const sut = makeSut();
    const hash = await sut.hash("any_value");
    expect(hash).toBe("hash");
  });

  test("should call compare with correcct values", async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });

  test("should return true on hash success", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(true);
  });

  test("should return false when compare fails", async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => new Promise((resolve) => resolve(false)));
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(false);
  });

  test("should throw if compare throws", async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(
        async () => new Promise((_, reject) => reject(new Error()))
      );
    const promise = sut.compare("any_value", "any_hash");

    await expect(promise).rejects.toThrow();
  });
});
