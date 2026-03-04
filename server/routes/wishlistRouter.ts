import express from 'express';
import {protect} from "../middlewares/auth.js";
import {getWishlist, toggleWishlist} from '../controllers/wishlistController.js'

const wishlistRouter = express.Router();

// All routes require user to be authenticated
wishlistRouter.use(protect);

// @route   GET /api/wishlist
// @desc    Fetch user's wishlist
wishlistRouter.get('/', getWishlist);

// @route   PATCH /api/wishlist/toggle/:productId
// @desc    Add or remove a product from wishlist
wishlistRouter.patch('/toggle/:productId', toggleWishlist);

export default wishlistRouter;