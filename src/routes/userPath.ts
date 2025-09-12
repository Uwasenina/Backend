import { login } from '../controllers/authoController';
import { signin} from '../controllers/userController';
import express from "express";

const userRouter=express();
userRouter.post("/userRegistration",signin);
userRouter.post("/login",login);

export default userRouter;