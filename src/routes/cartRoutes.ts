import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController";
import { requireSignin } from "../middleware/authenticationFunction";

const router = express.Router();

// All cart routes require authentication
router.use(requireSignin);

router.post("/cart", addToCart);
router.get("/cart", getCart);
router.put("/cart/:productId", updateCartItem);
router.delete("/cart/:productId", removeCartItem);

export default router;