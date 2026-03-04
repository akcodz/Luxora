import mongoose, { Schema } from 'mongoose';
import { ICart, ICartItem } from '../types/index.js';

const cartItemSchema = new Schema<ICartItem>(
    { product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        price: { type: Number, required: true },
        size: { type: String } },
    { _id: false });

const cartSchema = new Schema<ICart>(
    { user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    totalAmount: { type: Number, required: true, default: 0 } },
    { timestamps: true });

cartSchema.methods.calculateTotal = function (): number {
    this.totalAmount = this.items.reduce((total: number, item: ICartItem) => total + item.price * item.quantity, 0);
    return this.totalAmount;
};

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;