import express from "express";
import {
 createProduct ,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { requireSignin, checkAdmin } from "../middleware/authenticationFunction";
import upload from "../utils/multer";
const uploading=upload.single("productimage");

const router = express.Router();

// Public routes (no authentication required)
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// Admin only routes
router.post("/products", uploading, checkAdmin,  createProduct);
router.put("/products/:id", requireSignin, checkAdmin, updateProduct);
router.delete("/products/:id", requireSignin, checkAdmin, deleteProduct);

export default router;