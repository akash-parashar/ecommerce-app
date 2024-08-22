import express from "express";
import {
  allCoupons,
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  getCoupon,
  newCoupon,
  updateCoupon,
} from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// route - /api/v1/payment/create
app.post("/create",createPaymentIntent);

// createPaymentIntent


app.get("/discount", applyDiscount);
app.post("/coupon/new", adminOnly, newCoupon);

// route - /api/v1/payment/coupon/all
app.get("/coupon/all", adminOnly, allCoupons);

// route - /api/v1/payment/coupon/:id
app
  .route("/coupon/:id")
  .get(adminOnly, getCoupon)
  .put(adminOnly, updateCoupon)
  .delete(adminOnly, deleteCoupon);

export default app;
