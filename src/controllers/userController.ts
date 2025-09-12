import { User } from "../model/userModel";
import { NextFunction, Request, Response } from "express";
import { generateToken } from "../utils/tokenGeneration";
import bcrypt from "bcryptjs";


export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        const { email, password, username,userRole}= req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
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