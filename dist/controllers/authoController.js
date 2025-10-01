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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("../model/userModel");
const tokenGeneration_1 = require("../utils/tokenGeneration");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, confirmpassword, userRole } = req.body;
        if (!fullName || !email || !password || !confirmpassword) {
            res.status(400).json({ message: "Please fill all the fields" });
            return;
        }
        if (password !== confirmpassword) {
            res.status(400).json({ message: "Passwords do not match" });
            return;
        }
        const existingUser = yield userModel_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.User({
            fullName,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword,
            userRole,
        });
        yield newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully",
            newUser: { _id: newUser._id, fullName: newUser.fullName, email: newUser.email, userRole: newUser.userRole },
            token: (0, tokenGeneration_1.generateToken)(newUser) });
    }
    catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield userModel_1.User.findOne({ email });
        if (!existingUser) {
            console.log("❌ No user with that email.");
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, existingUser.password);
        console.log("🔑 Password match:", isPasswordValid); // 👈 log comparison
        if (!isPasswordValid) {
            console.log("❌ Incorrect password.");
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = (0, tokenGeneration_1.generateToken)(existingUser);
        existingUser.accessToken = token;
        yield existingUser.save();
        return res.status(200).json({
            message: "Login successful!",
            user: {
                id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                userRole: existingUser.userRole,
                token: token,
            },
        });
    }
    catch (error) {
        console.error("💥 Login error:", error);
        return res.status(500).json({ message: "Error logging in", error });
    }
});
exports.login = login;
