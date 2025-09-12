import express from "express";
import {
  saveProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const productRouter = express.Router();
productRouter.post("/products", saveProduct);
productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getProductById);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
