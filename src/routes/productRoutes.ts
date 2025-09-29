import express from "express";
import {
  saveProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { requireSignin, checkAdmin } from "../middleware/authenticationFunction";

const router = express.Router();

// Public routes (no authentication required)
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// Admin only routes
router.post("/products", requireSignin, checkAdmin, saveProduct);
router.put("/products/:id", requireSignin, checkAdmin, updateProduct);
router.delete("/products/:id", requireSignin, checkAdmin, deleteProduct);

export default router;