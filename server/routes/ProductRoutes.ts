import express from "express";
import { protect,authorize } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import { getProduct,getProducts,createProduct,updateProduct,deleteProduct } from "../controllers/productController.js";

const ProductRouter = express.Router();

// Public routes
ProductRouter.get("/", getProducts);
ProductRouter.get("/:id", getProduct);

// Admin-only routes
ProductRouter.post("/", protect, authorize(["admin"]), upload.array("images", 5), createProduct);
ProductRouter.put("/:id", protect, authorize(["admin"]), upload.array("images", 5), updateProduct);
ProductRouter.delete("/:id", protect, authorize(["admin"]), deleteProduct);

export default ProductRouter;