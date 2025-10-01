"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authenticationFunction_1 = require("../middleware/authenticationFunction");
const router = express_1.default.Router();
// Public routes (no authentication required)
router.get("/products", productController_1.getProducts);
router.get("/products/:id", productController_1.getProductById);
// Admin only routes
router.post("/products", authenticationFunction_1.requireSignin, authenticationFunction_1.checkAdmin, productController_1.saveProduct);
router.put("/products/:id", authenticationFunction_1.requireSignin, authenticationFunction_1.checkAdmin, productController_1.updateProduct);
router.delete("/products/:id", authenticationFunction_1.requireSignin, authenticationFunction_1.checkAdmin, productController_1.deleteProduct);
exports.default = router;
