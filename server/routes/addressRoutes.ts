import express from "express";
import {
    addAddress,
    deleteAddress,
    getAddresses,
    updateAddress,
} from "../controllers/addressController.js";
import {protect} from "../middlewares/auth.js";

const AddressRouter = express.Router();

// Get all addresses for logged-in user
AddressRouter.get("/", protect, getAddresses);

// Add new address
AddressRouter.post("/", protect, addAddress);

// Update address
AddressRouter.put("/:id", protect, updateAddress);

// Delete address
AddressRouter.delete("/:id", protect, deleteAddress);

export default AddressRouter;