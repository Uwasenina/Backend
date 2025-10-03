import Product from "../model/productModel";
import { Request, Response } from "express";
import cloudinary from "../utils/Cloudhandle";
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { prodName, prodDesc, prodPrice, ProdCat ,productimage} = req.body;

  
    
        if(!req.file){
            return res.status(400).json({message:"No image uploaded"})
        }
        const result=await cloudinary.uploader.upload(req.file.path,{
            folder:"products"
        });
        const imageUrl=result.secure_url;
        // Create new product
        const newProduct = new Product({
            prodName,
            prodDesc,
            prodPrice,
            ProdCat,
            productimage:imageUrl
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: savedProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}



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
