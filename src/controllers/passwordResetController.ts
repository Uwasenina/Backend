import { Request, Response } from "express";
import { User } from "../model/userModel";
import PasswordReset from "../model/passwordResetModel";
import mailerSender from "../utils/sendEmails";
import bcrypt from "bcryptjs";
export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await PasswordReset.create({
            userId: user._id,
            otp, expiresAt
        });
        await mailerSender(
            user.email,
            "Password Reset OTP",
            `
            <p>Hello ${user.fullName},</p>
            <p>Your OTP for password reset is: ${otp}</p>
            <p>This OTP is valid for 1 minute.</p>`
        );
        res.status(200).json({ message: "OTP sent to email" });
    } catch (error: any) {
        res.status(500).json({ message: "Error generating OTP", error: error.message });
    }
};
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        const user = await User.findOne({ email}).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const record = await PasswordReset.findOne({
            userId: user._id,
            otp,
            expiresAt: { $gt: new Date()}
        });
        if (!record) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        const hashedpassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedpassword;
        await user.save();
        await PasswordReset.deleteMany({ userId: user._id });
        return res.status(200).json({ message: "Password reset successful" });
    } catch (error: any) {
        res.status(500).json({ message: "Error resetting password", error: error.message || error});
    }
};

