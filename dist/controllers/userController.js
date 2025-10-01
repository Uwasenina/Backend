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
exports.getUserProfile = exports.getUser = exports.signin = void 0;
const userModel_1 = require("../model/userModel");
const tokenGeneration_1 = require("../utils/tokenGeneration");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { email, password, fullName, userRole } = req.body;
        const existingUser = yield userModel_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.User({
            fullName,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword,
            userRole,
            // accessToken: "",
        });
        const token = (0, tokenGeneration_1.generateToken)(newUser);
        newUser.accessToken = token;
        yield newUser.save();
        return res.status(201).json({ message: "User created successfully", newUser });
    }
    catch (error) {
        return res.status(400).json({ message: "Error user not registered", error: error.message });
    }
});
exports.signin = signin;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.User.find();
        return res.status(200).json({ users });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});
exports.getUser = getUser;
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // `req.user` will be set in your JWT middleware (requireSignin)
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - No user ID found" });
        }
        const user = yield userModel_1.User.findById(userId).select("-password -confirmpassword");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                // profileImage: user.profileImage || null, // if you store images
                userRole: user.userRole,
                accessToken: user.accessToken,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
});
exports.getUserProfile = getUserProfile;
