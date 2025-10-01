"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authoController_1 = require("../controllers/authoController");
const userController_1 = require("../controllers/userController");
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
userRouter.post("/userRegistration", userController_1.signin);
userRouter.get("/users", userController_1.getUser);
userRouter.post("/login", authoController_1.login);
userRouter.get("/profile", userController_1.getUserProfile);
exports.default = userRouter;
