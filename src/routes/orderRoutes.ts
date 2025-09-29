import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController";
import { requireSignin } from "../middleware/authenticationFunction";

const router = express.Router();

// All order routes require authentication
router.use(requireSignin);

router.post("/orders", placeOrder);
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.delete("/orders/:id", cancelOrder);

export default router;