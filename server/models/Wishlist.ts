import mongoose, {Schema} from 'mongoose';
import {IWishlist} from "../types/index.js";

const wishlistSchema = new Schema<IWishlist>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Wishlist', wishlistSchema);