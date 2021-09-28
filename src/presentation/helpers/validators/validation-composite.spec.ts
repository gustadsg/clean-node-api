/* eslint-disable import/no-extraneous-dependencies */
import faker from "faker";
import { ValidationComposite } from "./validation-composite";
import { MissingParamError } from "../../errors";
import { Validation } from "./validation";

interface SutTypes {
  validationStubs: Validation[];
  sut: ValidationComposite;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);

  return {
    validationStubs,
    sut,
  };
};

describe("ValidationComposite", () => {
  test("should return an error if any validation fails", () => {
    const { validationStubs, sut } = makeSut();

    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("filed"));

    const error = sut.validate([{ InvalidField: faker.random.word() }]);
    expect(error).toEqual(new MissingParamError("filed"));
  });

  test("should the first error if more than one validation fails", () => {
    const { validationStubs, sut } = makeSut();

    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());

    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("filed"));

    const error = sut.validate([{ InvalidField: faker.random.word() }]);
    expect(error).toEqual(Error());
  });

  test("should return null if validation succeeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: faker.random.word() });
    expect(error).toBeNull();
  });
});
