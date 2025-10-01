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
exports.resetPassword = exports.requestPasswordReset = void 0;
const userModel_1 = require("../model/userModel");
const passwordResetModel_1 = __importDefault(require("../model/passwordResetModel"));
const sendEmails_1 = __importDefault(require("../utils/sendEmails"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        yield passwordResetModel_1.default.create({
            userId: user._id,
            otp, expiresAt
        });
        yield (0, sendEmails_1.default)(user.email, "Password Reset OTP", `
            <p>Hello ${user.fullName},</p>
            <p>Your OTP for password reset is: ${otp}</p>
            <p>This OTP is valid for 1 minute.</p>`);
        res.status(200).json({ message: "OTP sent to email" });
    }
    catch (error) {
        res.status(500).json({ message: "Error generating OTP", error: error.message });
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        const user = yield userModel_1.User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const record = yield passwordResetModel_1.default.findOne({
            userId: user._id,
            otp,
            expiresAt: { $gt: new Date() }
        });
        if (!record) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        const hashedpassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedpassword;
        yield user.save();
        yield passwordResetModel_1.default.deleteMany({ userId: user._id });
        return res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message || error });
    }
});
exports.resetPassword = resetPassword;
