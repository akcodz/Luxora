import {Request, Response} from "express";
import User from "../models/User.js";
import Product from "../models/Products.js";
import Order from "../models/Order.js";

export const     getDashboardStats
    = async (req: Request, res: Response) => {
    try {
        const [totalUsers, totalProducts, totalOrders] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
        ]);

        // Calculate revenue using aggregation (DB-level)
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $ne: "cancelled" } } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Get recent 5 orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email")
            .lean();

        res.json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                recentOrders,
            },
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};