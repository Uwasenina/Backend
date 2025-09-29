import { login } from '../controllers/authoController';
import { signin, getUser, getUserProfile} from '../controllers/userController';
import express from "express";

const userRouter=express.Router();
userRouter.post("/userRegistration",signin);
userRouter.get("/users",getUser);
userRouter.post("/login",login);
userRouter.get("/profile",getUserProfile);

export default userRouter;