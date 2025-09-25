import { User } from "../model/userModel";
import { NextFunction, Request, Response } from "express";
import { generateToken } from "../utils/tokenGeneration";
import bcrypt from "bcryptjs";


export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        const { email, password, fullName,confirmpassword, userRole}= req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            confirmpassword:hashedPassword,
            userRole,
            // accessToken: "",
        });
        const token=generateToken(newUser);
        newUser.accessToken=token;
        await newUser.save();
        return res.status(201).json({ message:"User created successfully",newUser });
        
    } catch (error: any) {
        return res.status(400).json({message: "Error user not registered", error: error.message});
    }
    
}
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();    
        return res.status(200).json({ users });
    } catch (error: any) {
        return res.status(500).json({ message: "Error fetching users", error: error.message });
    }       
};

export const getUserProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    // `req.user` will be set in your JWT middleware (requireSignin)
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID found" });
    }

    const user = await User.findById(userId).select("-password -confirmpassword");
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
  } catch (error: any) {
    return res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};