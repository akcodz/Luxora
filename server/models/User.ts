import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../types/index.js";

const userSchema = new Schema<IUser>(
    {
        name: { type: String, trim: true },
        email: { type: String, unique: true, trim: true, sparse: true },
        clerkId: { type: String, unique: true, sparse: true },
        image: { type: String },
        role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;