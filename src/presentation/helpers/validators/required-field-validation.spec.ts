/* eslint-disable import/no-extraneous-dependencies */
import faker from "faker";
import { MissingParamError } from "../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

const field = faker.random.word();

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation(field);

describe("RequiredFieldValidation", () => {
  test("should return an error if required field is missing", () => {
    const sut = makeSut();
    const isValid = sut.validate({ InvalidField: faker.random.word() });

    expect(isValid).toEqual(new MissingParamError(field));
  });

  test("should return null if required field is provided", () => {
    const sut = makeSut();
    const isValid = sut.validate({ [field]: faker.random.word() });

    expect(isValid).toBeNull();
  });
});
