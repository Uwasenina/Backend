"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const authenticationFunction_1 = require("../middleware/authenticationFunction");
const router = express_1.default.Router();
// All cart routes require authentication
router.use(authenticationFunction_1.requireSignin);
router.post("/cart", cartController_1.addToCart);
router.get("/cart", cartController_1.getCart);
router.put("/cart/:productId", cartController_1.updateCartItem);
router.delete("/cart/:productId", cartController_1.removeCartItem);
exports.default = router;
