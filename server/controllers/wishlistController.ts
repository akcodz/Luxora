import {Request,Response} from "express";
import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req:Request, res:Response) => {
    const userId = req.user?._id

    const wishlist = await Wishlist.findOne({ user: userId })
        .populate('products');

    res.status(200).json({
        success: true,
        data: wishlist?.products || [],
    });
};

export const toggleWishlist = async (req:Request, res:Response) => {
    const userId = req.user._id;
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            products: [productId],
        });
    } else {
        const exists = wishlist.products.some((id) => id.toString() === productId);

        if (exists) {
            wishlist.products = wishlist.products.filter(
                (id) => id.toString() !== productId
            );
        } else {
            wishlist.products.push(productId as any);
        }

        await wishlist.save();
    }

    res.status(200).json({
        success: true,
        data: wishlist.products,
    });
};