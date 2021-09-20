import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helpers/mogo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountColletcion = MongoHelper.getConnection("accounts");

    if (!accountColletcion) {
      throw new Error("account collection does not exist");
    }

    const result = await accountColletcion.insertOne(accountData);
    const insertedId = result?.insertedId;
    const insertedObj = await accountColletcion.findOne(insertedId);

    if (!insertedObj) {
      throw new Error("unable to insert object");
    }

    const account = MongoHelper.map(insertedObj);

    return account;
  }
}
