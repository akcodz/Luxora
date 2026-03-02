import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import connectDB from "./config/db.js";
import {clerkWebhook} from "./controllers/webhook.js";

const app = express();
connectDB()

// Middleware
app.use(cors())
app.use(express.json());
app.use(clerkMiddleware())


const port = process.env.PORT || 3000;

app.post('/api/clerk',express.raw({type:'application/json'}),clerkWebhook)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});