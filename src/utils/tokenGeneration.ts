import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../model/userModel";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "defaul";
export const generateToken = (user: IUser): string => {
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    } 
    return jwt.sign(
        { 
            _id: user._id, 
            email: user.email, 
            userRole: user.userRole }, 
            jwtSecret, 
            { expiresIn: '7h' }
        );
    }