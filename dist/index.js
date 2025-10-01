"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const dotenv_1 = __importDefault(require("dotenv"));
// Routers
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const userPath_1 = __importDefault(require("./routes/userPath"));
const contactPath_1 = __importDefault(require("./routes/contactPath"));
const passwordResetRoutes_1 = __importDefault(require("./routes/passwordResetRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/contact", contactPath_1.default); // /api/contact/send-email
// Protected routes: only authenticated users
app.use("/api/users", userPath_1.default); // apply requireSignin inside userRouter where needed
app.use("/api/products", productRoutes_1.default); // protect specific product routes inside router
app.use("/api/cart", cartRoutes_1.default); // protect specific cart routes inside router
app.use("/api/orders", orderRoutes_1.default);
app.use("/api", passwordResetRoutes_1.default);
app.use("/api", dashboardRoutes_1.default);
// protect specific order routes inside router
// /api/password-reset/request-reset, /api/password-reset/reset-password
mongoose_1.default
    .connect(`mongodb+srv://${db_user}:${db_password}@cluster0.vqqhxqq.mongodb.net/${db_name}`)
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
