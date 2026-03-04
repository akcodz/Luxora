import { Request, Response } from 'express';
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Products.js";

export const getOrders = async (req: Request, res: Response) => {
    try {
        // Build query: fetch orders for logged-in user
        const query = { user: req.user?._id };

        const orders = await Order.find(query)
            .populate('items.product', 'name images')
            .sort('-createdAt');

        res.json({ success: true, data: orders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createOrder = async (req:Request, res:Response) => {
    try {
        const { shippingAddress, notes } = req.body;
        const userId = req.user._id;

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required",
            });
        }

        // Fetch cart with populated products
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product")

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const orderItems = [];

        // Verify stock & prepare order items
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id)

            if (!product) {
                throw new Error("Product not found");
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
            // Deduct stock
            product.stock -= item.quantity;
            await product.save();
        }

        const subtotal = cart.totalAmount
        const shippingCost=2
        const tax=0
        const totalAmount=subtotal + shippingCost + tax
        // Create order
        const order = await Order.create(
                {
                    user: userId,
                    items: orderItems,
                    totalAmount,
                    shippingAddress,
                    paymentMethod: req.body.paymentMethod || 'cash',
                    notes,
                    paymentStatus: "pending",
                    subtotal,
                    tax,
                    paymentIntentId: req.body.paymentIntentId,
                    orderNumber: "ORD-"+ Date.now()
                },
        )
        if(req.body.paymentMethod !== "stripe"){
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();

        }

        res.status(201) .json({success: true, data: order})
    } catch (error:any) {

        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        if (orderStatus === "delivered") {
            order.deliveredAt = new Date();
        }

        await order.save();

        res.json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const query: any = {};

        if (status) {
            query.orderStatus = status;
        }

        // Get total count for pagination
        const total = await Order.countDocuments(query);

        const orders = await Order.find(query)
            .populate("user", "name email")
            .populate("items.product", "name")
            .sort("-createdAt")
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};