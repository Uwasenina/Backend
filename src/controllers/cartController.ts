import { Request, Response } from "express";
import CartItem from "../model/cartModel";
import Product from "../model/productModel";
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found." });
    let cartItem = await CartItem.findOne({ productId });
    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.subtotal = cartItem.quantity * product.price;
      await cartItem.save();
      return res.status(200).json({cartItem});
    }
    const newCartItem = await CartItem.create({
      productId,
      quantity,
      subtotal: quantity * product.price,
    });

    return res.status(201).json({newCartItem});
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
export const getCart = async (_req: Request, res: Response) => {
  try {
    const cartItems = await CartItem.find().populate("productId");
    return res.status(200).json({cartItems});
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch cart items." });
  }
};
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found." });
    const cartItem = await CartItem.findOne({ productId });
    if (!cartItem) return res.status(404).json({ error: "Item not in cart." });
    cartItem.quantity = quantity;
    cartItem.subtotal = quantity * product.price;
    await cartItem.save();
    return res.status(200).json({cartItem});
  } catch (error) {
    return res.status(500).json({ error: "Failed to update cart item." });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const deletedItem = await CartItem.findOneAndDelete({ productId });
    if (!deletedItem)
      return res.status(404).json({ error: "Item not found in cart." });
    return res.status(200).json({ message: "Item removed from cart." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to remove item." });
  }
};
