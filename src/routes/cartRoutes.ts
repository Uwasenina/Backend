import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController";

const cartRouter = express.Router();

cartRouter.post("/cart", addToCart);
cartRouter.get("/cart", getCart);
cartRouter.put("/cart/:productId", updateCartItem);
cartRouter.delete("/cart/:productId", removeCartItem);

export default cartRouter;
