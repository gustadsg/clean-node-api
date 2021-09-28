/* eslint-disable import/no-extraneous-dependencies */
import faker from "faker";
import { ValidationComposite } from "./validation-composite";
import { MissingParamError } from "../../errors";
import { Validation } from "./validation";

interface SutTypes {
  validationStub: Validation;
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
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);

  return {
    validationStub,
    sut,
  };
};

describe("ValidationComposite", () => {
  test("should return an error if any validation fails", () => {
    const { validationStub, sut } = makeSut();

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("filed"));

    const error = sut.validate([{ InvalidField: faker.random.word() }]);
    expect(error).toEqual(new MissingParamError("filed"));
  });
});
