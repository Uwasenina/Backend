import { Request, Response } from "express";
import Order from "../model/orderModel";
import CartItem from "../model/cartModel";
import Product from "../model/productModel";

export const placeOrder = async (_req: Request, res: Response) => {
  try {
    const cartItems = await CartItem.find();

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty. Cannot place order." });
    }
    let totalPrice = 0;
    const orderItems = [];
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product with id ${item.productId} not found.` });
      }
      const itemTotal = item.quantity * product.price;
      totalPrice += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }
    const newOrder = await Order.create({
      items: orderItems,
      totalPrice,
    });
    await CartItem.deleteMany();

    return res.status(201).json({newOrder});
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("items.productId");
    return res.status(200).json({orders});
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders." });
  }
};
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");
    if (!order) return res.status(404).json({ error: "Order not found." });
    return res.status(200).json({order});
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch order." });
  }
};
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ error: "Order not found." });

    return res.status(200).json({ message: "Order cancelled successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to cancel order." });
  }
};
