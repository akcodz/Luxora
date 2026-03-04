import { Request, Response } from 'express';
import Address from "../models/Address.js";

export const getAddresses = async (req: Request, res: Response) => {
    try {
        const addresses = await Address
            .find({ user: req.user._id })
            .sort({ isDefault: -1, createdAt: -1 });

        res.json({ success: true, data: addresses });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const addAddress = async (req: Request, res: Response) => {
    try {
        const { type, street, city, state, zipCode, country, isDefault } = req.body;

        // If setting as default, remove previous default
        if (isDefault) {
            await Address.updateMany(
                { user: req.user._id },
                { isDefault: false }
            );
        }

        const newAddress = await Address.create({
            user: req.user._id,
            type,
            street,
            city,
            state,
            zipCode,
            country,
            isDefault: isDefault || false,
        });

        res.status(201).json({
            success: true,
            data: newAddress,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const { type, street, city, state, zipCode, country, isDefault } = req.body;
        const userId = req.user._id;
        const addressId = req.params.id;

        const address = await Address.findOne({ _id: addressId, user: userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        // If setting this address as default
        if (isDefault === true) {
            await Address.updateMany(
                { user: userId },
                { isDefault: false }
            );
            address.isDefault = true;
        }

        // Update only provided fields (partial update)
        if (type) address.type = type;
        if (street) address.street = street;
        if (city) address.city = city;
        if (state) address.state = state;
        if (zipCode) address.zipCode = zipCode;
        if (country) address.country = country;

        await address.save();

        res.json({
            success: true,
            data: address,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.id;

        const address = await Address.findOne({
            _id: addressId,
            user: userId,
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        const wasDefault = address.isDefault;

        await address.deleteOne();

        // If deleted address was default, assign another one as default
        if (wasDefault) {
            const nextAddress = await Address.findOne({ user: userId })
                .sort({ createdAt: -1 });

            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        res.json({
            success: true,
            message: "Address deleted successfully",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};