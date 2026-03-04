import express from "express";
import {authorize, protect} from "../middlewares/auth.js";
import {createOrder, getAllOrders, getOrder, getOrders, updateOrderStatus} from "../controllers/orderController.js";

const OrderRouter = express.Router();

    // ADMIN ROUTES
// Get all orders (Admin only)
OrderRouter.get(
    "/admin/all",
    protect,
    authorize(["admin"]),
    getAllOrders
);

// Update order status (Admin only)
OrderRouter.put(
    "/admin/:id/status",
    protect,
    authorize(["admin"]),
    updateOrderStatus
);

    // USER ROUTES

// Get logged-in user's orders
OrderRouter.get("/", protect, getOrders);

// Get single order
OrderRouter.get("/:id", protect, getOrder);

// Create order from cart
OrderRouter.post("/", protect, createOrder);


export default OrderRouter;