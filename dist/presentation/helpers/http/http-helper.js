"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = exports.created = exports.serverError = exports.unauthorized = exports.badRequest = void 0;
const errors_1 = require("../../errors");
const badRequest = (error) => ({
    statusCode: 400,
    body: error,
});
exports.badRequest = badRequest;
const unauthorized = () => ({
    statusCode: 401,
    body: new errors_1.UnauthorizedError(),
});
exports.unauthorized = unauthorized;
const serverError = (error) => ({
    statusCode: 500,
    body: new errors_1.ServerError(error === null || error === void 0 ? void 0 : error.stack),
});
exports.serverError = serverError;
const created = (data) => ({
    statusCode: 201,
    body: data,
});
exports.created = created;
const ok = (data) => ({
    statusCode: 200,
    body: data,
});
exports.ok = ok;
