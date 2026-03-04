import mongoose, { Schema } from 'mongoose';
import {IOrder, IOrderItem} from "../types/index.js";

// Schema for individual order items
const orderItemSchema = new Schema<IOrderItem>({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    size: { type: String },
});

// Schema for orders
const orderSchema = new Schema<IOrder>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderNumber: { type: String, unique: true },
        items: { type: [orderItemSchema], required: true },
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: { type: String, enum: ['cash', 'stripe'], default: 'cash', required: true },
        paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
        paymentIntentId: { type: String },
        orderStatus: { type: String, enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
        subtotal: { type: Number, required: true },
        shippingCost: { type: Number, default: 0 },
        tax: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        notes: { type: String },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;