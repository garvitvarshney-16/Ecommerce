import Express from "express";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";


const app = Express()


// route - /api/new/payment/create
app.post("/create", createPaymentIntent)

// route - /api/new/payment/discount
app.get("/discount", applyDiscount);

// route - /api/new/payment/coupon/new
app.post("/coupon/new",adminOnly, newCoupon);

// route - /api/new/payment/coupon/all
app.get("/coupon/all",adminOnly, allCoupons);

// route - /api/new/payment/coupon/:id
app.delete("/coupon/:id",adminOnly, deleteCoupon);

export default app;