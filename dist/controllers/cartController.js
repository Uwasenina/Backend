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
exports.removeCartItem = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const cartModel_1 = __importDefault(require("../model/cartModel"));
const productModel_1 = __importDefault(require("../model/productModel"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        const product = yield productModel_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ error: "Product not found." });
        let cartItem = yield cartModel_1.default.findOne({ productId });
        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.subtotal = cartItem.quantity * product.price;
            yield cartItem.save();
            return res.status(200).json({ cartItem });
        }
        const newCartItem = yield cartModel_1.default.create({
            productId,
            quantity,
            subtotal: quantity * product.price,
        });
        return res.status(201).json({ newCartItem });
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});
exports.addToCart = addToCart;
const getCart = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartItems = yield cartModel_1.default.find().populate("productId");
        return res.status(200).json({ cartItems });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch cart items." });
    }
});
exports.getCart = getCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const product = yield productModel_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ error: "Product not found." });
        const cartItem = yield cartModel_1.default.findOne({ productId });
        if (!cartItem)
            return res.status(404).json({ error: "Item not in cart." });
        cartItem.quantity = quantity;
        cartItem.subtotal = quantity * product.price;
        yield cartItem.save();
        return res.status(200).json({ cartItem });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to update cart item." });
    }
});
exports.updateCartItem = updateCartItem;
const removeCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const deletedItem = yield cartModel_1.default.findOneAndDelete({ productId });
        if (!deletedItem)
            return res.status(404).json({ error: "Item not found in cart." });
        return res.status(200).json({ message: "Item removed from cart." });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to remove item." });
    }
});
exports.removeCartItem = removeCartItem;
