import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helpers/mogo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountColletcion = await MongoHelper.getConnection("accounts");

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

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountColletcion = await MongoHelper.getConnection("accounts");

    if (!accountColletcion) {
      throw new Error("account collection does not exist");
    }

    const foundObj = await accountColletcion.findOne<AccountModel>({ email });

    if (!foundObj) {
      return null;
    }
    const account = MongoHelper.map(foundObj);

    return account;
  }
}
