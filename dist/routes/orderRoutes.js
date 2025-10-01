"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authenticationFunction_1 = require("../middleware/authenticationFunction");
const router = express_1.default.Router();
// All order routes require authentication
router.use(authenticationFunction_1.requireSignin);
router.post("/orders", orderController_1.placeOrder);
router.get("/orders", orderController_1.getOrders);
router.get("/orders/:id", orderController_1.getOrderById);
router.delete("/orders/:id", orderController_1.cancelOrder);
exports.default = router;
