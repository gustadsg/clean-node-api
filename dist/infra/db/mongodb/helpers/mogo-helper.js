"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoHelper = void 0;
const mongodb_1 = require("mongodb");
exports.MongoHelper = {
    client: null,
    url: null,
    async connect(url) {
        this.url = url;
        this.client = await mongodb_1.MongoClient.connect(url);
    },
    async disconnect() {
        if (this.client)
            await this.client.close();
    },
    async getConnection(name) {
        var _a;
        if (!this.client)
            await this.connect(this.url || "");
        return ((_a = this.client) === null || _a === void 0 ? void 0 : _a.db().collection(name)) || null;
    },
    map(collection) {
        const { _id, ...collectionWithOutId } = collection;
        return {
            id: _id.id.toString("hex"),
            ...collectionWithOutId,
        };
    },
};
