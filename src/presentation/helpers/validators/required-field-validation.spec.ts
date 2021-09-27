/* eslint-disable import/no-extraneous-dependencies */
import faker from "faker";
import { RequiredFieldValidation } from "./required-field-validation";

const field = faker.random.word();

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation(field);

describe("RequiredFieldValidation", () => {
  test("should return null if required field is provided", () => {
    const sut = makeSut();
    const isValid = sut.validate({ [field]: faker.random.word() });

    expect(isValid).toBeNull();
  });
});
