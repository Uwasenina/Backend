"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userPath_1 = __importDefault(require("./userPath"));
const express_1 = __importDefault(require("express"));
const mainRouter = (0, express_1.default)();
mainRouter.use("/user", userPath_1.default);
exports.default = mainRouter;
