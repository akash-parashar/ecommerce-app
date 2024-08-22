import express, { Request, Response } from "express";
import userRouter from "./routes/user.js";
import productRouter from "./routes/products.js";
import orderRouter from "./routes/order.js"
import couponRouter from "./routes/payment.js"
import dashboardRoute from "./routes/stats.js";
import { connectDB } from "./utils/feature.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors"


config({
  path:"./.env"
})



const port =process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";
const stripKey = process.env.STRIPE_KEY ||""

const app = express();
app.use(morgan("dev"))
app.use(cors())
connectDB(mongoURI);

app.use(express.json());
app.use(errorMiddleware);

export const stripe = new Stripe(stripKey)

export const myCache = new NodeCache()


//user route
app.use("/api/v1/user", userRouter);
//product route
app.use("/api/v1/product", productRouter);

//order routes
app.use("/api/v1/order",orderRouter)
//payment route
app.use("/api/v1/payment",couponRouter)
//ADMIB DASHBOARD ROUTE
app.use("/api/v1/dashboard", dashboardRoute);

//declaring as static
app.use("/uploads", express.static("uploads"));

//error

app.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
