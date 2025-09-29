import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "defaul";

export const requireSignin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Authentication is required");
    }

    const token = req.headers.authorization.split(" ")[1]; // ✅ fix
    const verifytoken: any = jwt.verify(token, JWT_SECRET);

    const rootuser = await User.findById(verifytoken._id); // ✅ fix
    if (!rootuser) throw new Error("User not found");

    req.user = rootuser;
    next();
  } catch (error: any) {
    return res.status(400).json({
      message: "Authorization required",
      error: error?.message || error,
    });
  }
};

export const checkAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "User is not admin" }); // ✅ use 403 for permission
  }
  next();
};
