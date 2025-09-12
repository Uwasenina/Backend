import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRouter from "./src/routes/productRoutes";
import cartRouter from "./src/routes/cartRoutes";
import orderRouter from "./src/routes/orderRoutes";
import userRouter from "./src/routes/userPath";
import mainRouter from "./src/routes/indexRouting";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.use((req, _res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
mongoose
  .connect(
    "mongodb+srv://nina:qUM86nfcJcRomopx@cluster0.vqqhxqq.mongodb.net/mini_ecommerce"
  )
  .then(() => {
    console.log("MongoDB connected ");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect MongoDB:", err.message);
  });
  
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", userRouter);
app.use("/api_v1", mainRouter);
