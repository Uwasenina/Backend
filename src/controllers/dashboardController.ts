import { Request, Response } from "express";
import Product from "../model/productModel";
import Order from "../model/orderModel";
import mongoose from "mongoose";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // 📊 Total Stats
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    // 📈 Revenue per day (last 7 days)
    const revenueData = await Order.aggregate([
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
    const categoryData = await Product.aggregate([
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
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: (error as Error).message,
    });
  }
};
