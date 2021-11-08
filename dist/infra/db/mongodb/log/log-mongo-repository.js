"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMongoRepository = void 0;
const mogo_helper_1 = require("../helpers/mogo-helper");
class LogMongoRepository {
    async logError(stack) {
        const errorCollection = await mogo_helper_1.MongoHelper.getConnection("errors");
        await (errorCollection === null || errorCollection === void 0 ? void 0 : errorCollection.insertOne({
            stack,
            date: new Date(),
        }));
    }
}
exports.LogMongoRepository = LogMongoRepository;
