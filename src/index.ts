import { PasswordReset } from './model/passwordResetModel';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import 'dotenv/config';
import dotenv from "dotenv";



// Routers
import productRouter from "./routes/productRoutes";
import cartRouter from "./routes/cartRoutes";
import orderRouter from "./routes/orderRoutes";
import userRouter from "./routes/userPath";
import contactRouter from "./routes/contactPath";
import  requestPasswordReset from "./routes/passwordResetRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
// Middleware
import { requireSignin } from "./middleware/authenticationFunction";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI=process.env.MONGODB_URI
const db_user=process.env.DB_USER
const db_password=process.env.DB_PASSWORD
const db_name=process.env.DB_NAME



// Middleware
app.use(express.json());
app.use(cors());


app.use("/api/contact", contactRouter); // /api/contact/send-email

// Protected routes: only authenticated users
app.use("/api/users", userRouter); // apply requireSignin inside userRouter where needed
app.use("/api/products", productRouter); // protect specific product routes inside router
app.use("/api/cart", cartRouter);       // protect specific cart routes inside router
app.use("/api/orders", orderRouter); 
app.use("/api", requestPasswordReset);

app.use("/api", dashboardRoutes);
// protect specific order routes inside router


 // /api/password-reset/request-reset, /api/password-reset/reset-password


mongoose
.connect(`mongodb+srv://${db_user}:${db_password}@cluster0.vqqhxqq.mongodb.net/${db_name}`
  )
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
