import userRouter from "./userPath";
 import Router from "express";
 const mainRouter = Router();
 mainRouter.use("/user", userRouter);
 export default mainRouter;
 