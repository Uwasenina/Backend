import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/orders", placeOrder);
orderRouter.get("/orders", getOrders);
orderRouter.get("/orders/:id", getOrderById);
orderRouter.delete("/orders/:id", cancelOrder);

export default orderRouter;
