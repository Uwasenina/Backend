import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../model/userModel";
import { generateToken } from "../utils/tokenGeneration";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Validate password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT token
    const token = generateToken(existingUser);
    existingUser.accessToken = token;
    await existingUser.save();

    // 4. Send response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        userRole: existingUser.userRole,
        accessToken: existingUser.accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};
