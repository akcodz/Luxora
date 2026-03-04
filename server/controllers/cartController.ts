import { Request, Response } from 'express';
import Cart from "../models/Cart.js";
import Product from "../models/Products.js";

export const getCart = async (req: Request, res: Response) => {
    try {
        let cart = await Cart.findOne({ user: req.user?.id })
            .populate('items.product', 'name images price stock');

        if (!cart) {
            cart = await Cart.create({ user: req.user?.id, items: [] });
        }

        res.json({ success: true, data: cart });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId, quantity = 1, size } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ user: req.user?.id });
        if (!cart) {
            cart = await Cart.create({ user: req.user?.id, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (existingItem ) {
            existingItem.quantity += quantity;
            existingItem.price =product.price;
        } else {
            cart.items.push({ product: productId, quantity, price: product.price, size });
        }

        cart.calculateTotal();

        await cart.save();
        await  cart.populate('items.product', 'name images price stock');

        res.json({ success: true, data: cart });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCart = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { quantity, size } = req.body;

        const cart = await Cart.findOne({ user: req.user?.id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const item = cart.items.find(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

        if (quantity <= 0) {
            cart.items = cart.items.filter(
                (item) => !(item.product.toString() === productId && item.size === size)
            );
        } else {
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
            if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock' });

            item.quantity = quantity;
        }

        cart.calculateTotal();
        await cart.save();
        await  cart.populate('items.product', 'name images price stock');
        res.json({ success: true, data: cart });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeCartItem = async (req: Request, res: Response) => {
    try {
        const { size } = req.query
        const { productId } = req.params;

        if (!productId || !size) {
            return res.status(400).json({ success: false, message: 'Product ID and size are required' });
        }

        const cart = await Cart.findOne({ user: req.user?._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId || item.size !== size
        );

        cart.calculateTotal();
        await cart.save();

        res.json({ success: true, data: cart });

        await  cart.populate('items.product', 'name images price stock');
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const clearCart = async (req: Request, res: Response) => {
    try {
        const cart = await Cart.findOne({ user: req.user?._id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalAmount = 0;

        await cart.save();

        res.json({ success: true, message: 'Cart cleared' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};