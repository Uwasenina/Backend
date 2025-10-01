"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.saveProduct = void 0;
const productModel_1 = __importDefault(require("../model/productModel"));
const saveProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { name, price, description, imageUrl, category } = req.body;
        const newProduct = yield productModel_1.default.create({
            name: name,
            price,
            description,
            imageUrl,
            category,
        });
        return res.status(201).json({ newProduct });
    }
    catch (error) {
        console.error("Error saving product:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});
exports.saveProduct = saveProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_1.default.find();
        console.log(products);
        return res.json({ products: products });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch products." });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ error: "Product not found." });
        console.log(product);
        res.status(200).json({ product });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch product." });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProduct = yield productModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct)
            return res.status(404).json({ error: "Product not found." });
        return res.status(200).json({ updatedProduct });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to update product." });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedProduct = yield productModel_1.default.findByIdAndDelete(req.params.id);
        if (!deletedProduct)
            return res.status(404).json({ error: "Product not found." });
        return res.status(200).json({ message: "Product deleted successfully." });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete product." });
    }
});
exports.deleteProduct = deleteProduct;
