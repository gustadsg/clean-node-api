"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMongoRepository = void 0;
const mongodb_1 = require("mongodb");
const mogo_helper_1 = require("../helpers/mogo-helper");
class AccountMongoRepository {
    async add(accountData) {
        const accountColletcion = await mogo_helper_1.MongoHelper.getConnection("accounts");
        if (!accountColletcion) {
            throw new Error("account collection does not exist");
        }
        const result = await accountColletcion.insertOne(accountData);
        const insertedId = result === null || result === void 0 ? void 0 : result.insertedId;
        const insertedObj = await accountColletcion.findOne(insertedId);
        if (!insertedObj) {
            throw new Error("unable to insert object");
        }
        const account = mogo_helper_1.MongoHelper.map(insertedObj);
        return account;
    }
    async loadByEmail(email) {
        const accountColletcion = await mogo_helper_1.MongoHelper.getConnection("accounts");
        if (!accountColletcion) {
            throw new Error("account collection does not exist");
        }
        const foundObj = await accountColletcion.findOne({ email });
        if (!foundObj) {
            return null;
        }
        const account = mogo_helper_1.MongoHelper.map(foundObj);
        return account;
    }
    async updateAccessToken(id, token) {
        const accountColletcion = await mogo_helper_1.MongoHelper.getConnection("accounts");
        if (!accountColletcion) {
            throw new Error("account collection does not exist");
        }
        const objId = new mongodb_1.ObjectId(id);
        await accountColletcion.updateOne({ _id: objId }, { $set: { accessToken: token } });
    }
}
exports.AccountMongoRepository = AccountMongoRepository;
