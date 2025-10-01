"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = exports.requireSignin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
const JWT_SECRET = process.env.JWT_SECRET || "defaul";
const requireSignin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            throw new Error("Authentication is required");
        }
        const token = req.headers.authorization.split(" ")[1]; // ✅ fix
        const verifytoken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const rootuser = yield userModel_1.User.findById(verifytoken._id); // ✅ fix
        if (!rootuser)
            throw new Error("User not found");
        req.user = rootuser;
        next();
    }
    catch (error) {
        return res.status(400).json({
            message: "Authorization required",
            error: (error === null || error === void 0 ? void 0 : error.message) || error,
        });
    }
});
exports.requireSignin = requireSignin;
const checkAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
        return res.status(403).json({ message: "User is not admin" }); // ✅ use 403 for permission
    }
    next();
};
exports.checkAdmin = checkAdmin;
