import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./config/db.js";
import { clerkWebhook } from "./controllers/webhook.js";
import ProductRouter from "./routes/ProductRoutes.js";
import CartRouter from "./routes/cartRoutes.js";
import OrderRouter from "./routes/orderRoutes.js";
import AddressRouter from "./routes/addressRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import wishlistRouter from "./routes/wishlistRouter.js";

const app = express();
connectDB();

app.post("/api/clerk",express.raw({ type: "application/json" }),clerkWebhook
);

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.use('/api/products',ProductRouter)
app.use('/api/cart',CartRouter)
app.use('/api/orders',OrderRouter)
app.use('/api/addresses',AddressRouter)
app.use('/api/admin',AdminRouter)
app.use('/api/wishlist',wishlistRouter)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});