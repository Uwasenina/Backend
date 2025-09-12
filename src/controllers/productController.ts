import { Request, Response } from "express";
import Product from "../model/productModel";
export const saveProduct = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { name, price, description, imageUrl, category } = req.body;
    const newProduct = await Product.create({
      name: name,
      price,
      description,
      imageUrl,
      category,
    });
    return res.status(201).json({newProduct});
  } catch (error) { 
    console.error("Error saving product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    console.log(products);
    return res.json({products: products});
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products." });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    console.log(product)
    res.status(200).json({product});
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch product." });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ error: "Product not found." });
    return res.status(200).json({updatedProduct});
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product." });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: "Product not found." });
    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product." });
  }
};
