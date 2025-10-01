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
exports.getDashboardData = void 0;
const productModel_1 = __importDefault(require("../model/productModel"));
const orderModel_1 = __importDefault(require("../model/orderModel"));
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 📊 Total Stats
        const totalProducts = yield productModel_1.default.countDocuments();
        const totalOrders = yield orderModel_1.default.countDocuments();
        const totalSalesAgg = yield orderModel_1.default.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);
        const totalSales = ((_a = totalSalesAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        // 📈 Revenue per day (last 7 days)
        const revenueData = yield orderModel_1.default.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            { $limit: 7 },
        ]);
        // 🏷️ Top Categories (based on product count)
        const categoryData = yield productModel_1.default.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        // 🛒 Conversion Funnel (example logic: views, add to cart, checkout, purchases)
        // ⚠️ Replace this with actual tracking data if you have it
        const conversionData = {
            labels: ["Product Views", "Add to Cart", "Checkout", "Purchases"],
            data: [25000, 15000, 8000, totalOrders],
        };
        // 📅 Monthly revenue target (optional static goal)
        const monthlyTarget = {
            target: 1000000,
            revenue: totalSales,
            progress: Math.min((totalSales / 1000000) * 100, 100),
        };
        res.status(200).json({
            success: true,
            totalStats: {
                totalProducts,
                totalOrders,
                totalSales,
            },
            revenueData,
            categoryData,
            conversionData,
            monthlyTarget,
        });
    }
    catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message,
        });
    }
});
exports.getDashboardData = getDashboardData;
