import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../model/userModel";
import { generateToken } from "../utils/tokenGeneration";


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, confirmpassword, userRole } = req.body;    
    if(!fullName || !email || !password || !confirmpassword){
      res.status(400).json({message:"Please fill all the fields"});
      return;
    }
    if (password !== confirmpassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      confirmpassword: hashedPassword,
      userRole,
  });
  await newUser.save();
  res.status(201).json({ success: true, message: "User registered successfully", 
    newUser: {_id: newUser._id, fullName: newUser.fullName, email: newUser.email, userRole: newUser.userRole},
   token: generateToken(newUser) });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log("❌ No user with that email.");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    console.log("🔑 Password match:", isPasswordValid); // 👈 log comparison

    if (!isPasswordValid) {
      console.log("❌ Incorrect password.");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(existingUser);
    existingUser.accessToken = token;
    await existingUser.save();

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
  } catch (error) {
    console.error("💥 Login error:", error);
    return res.status(500).json({ message: "Error logging in", error });
  }
};

