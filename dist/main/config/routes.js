"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = require("fs");
const path_1 = require("path");
exports.default = (app) => {
    const router = (0, express_1.Router)();
    app.use("/api", router);
    const routesPath = (0, path_1.resolve)(__dirname, "..", "routes");
    (0, fs_1.readdirSync)(routesPath).map(async (file) => {
        if (!isTestFile(file)) {
            (await Promise.resolve().then(() => __importStar(require((0, path_1.resolve)(routesPath, file))))).default(router);
        }
    });
};
function isTestFile(path) {
    return path.includes(".test.") || path.includes(".spec.");
}
