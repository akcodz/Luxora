import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/backend/webhooks";
import User from "../models/User.js";

export const clerkWebhook = async (req: Request, res: Response) => {
    try {
        const evt = await verifyWebhook(req);

        if (evt.type === "user.created" || evt.type === "user.updated") {
            const userData = {
                clerkId: evt.data.id,
                email: evt.data.email_addresses?.[0]?.email_address,
                name: `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim(),
                image: evt.data.image_url,
            };

            await User.findOneAndUpdate(
                { clerkId: evt.data.id },
                userData,
                { upsert: true, new: true }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Webhook received",
        });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return res.status(400).json({
            success: false,
            message: "Webhook verification failed",
        });
    }
};