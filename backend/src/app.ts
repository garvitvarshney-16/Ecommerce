import Express from "express";
import { connectDB } from "./utils/feature.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dasboardRoute from "./routes/stats.js";
import NodeCache from "node-cache";
import { config } from "dotenv"
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors"

config({
    path: "./.env",
});

const PORT = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const stripekey = process.env.STRIPE_KEY|| "";

connectDB(mongoURI);

export const stripe = new Stripe(stripekey)
export const myCache = new NodeCache();

const app = Express();
app.use(Express.json())
app.use(morgan("dev"));
app.use(cors())

app.get("/", (req, res) => {
    res.send("hello")
})

// using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dasboardRoute);
app.use(errorMiddleware);
app.use("/upload", Express.static("upload"))

app.listen(PORT, () => {
    console.log(`Express Server is working on ${PORT}`);
})