/* eslint-disable import/no-extraneous-dependencies */
import faker from "faker";
import { InvalidParamError } from "../../errors";
import { CompareFieldsValidation } from "./compare-fields-validation";

const fieldName = faker.random.word();
const fieldToCompare = faker.random.word();

const makeSut = (): CompareFieldsValidation =>
  new CompareFieldsValidation(fieldName, fieldToCompare);

describe("CompareFieldsValidation", () => {
  test("should return an Error if fields are different", () => {
    const sut = makeSut();

    const isValid = sut.validate({
      [fieldName]: "any_value",
      [fieldToCompare]: "other_value",
    });

    expect(isValid).toEqual(new InvalidParamError(fieldToCompare));
  });
});
