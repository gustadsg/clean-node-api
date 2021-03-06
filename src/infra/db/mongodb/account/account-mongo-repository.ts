import { ObjectId } from "mongodb";
import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helpers/mogo-helper";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/account/update-access-token-repository";

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
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

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountColletcion = await MongoHelper.getConnection("accounts");

    if (!accountColletcion) {
      throw new Error("account collection does not exist");
    }

    const objId = new ObjectId(id);

    await accountColletcion.updateOne(
      { _id: objId },
      { $set: { accessToken: token } }
    );
  }
}
