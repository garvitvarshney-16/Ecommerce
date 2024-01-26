import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
    mongoose.connect(uri, {
        dbName: "Newecomm",
    })
        .then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e))
}


export const invalidatesCache = async ({ product, order, admin, userId, orderId, productId}: InvalidateCacheProps) => {
    if (product) {
        const productKeys: string[] = [
            "latest-products",
            "categories",
            "all-products",
        ];

        if (typeof productId === "string") {
            productKeys.push(`product-${productId}`);
        }

        if (typeof productId === "object") {
            productId.forEach((i) => productKeys.push(`product-${i}`));
            console.log("lol");
        }

        myCache.del(productKeys)
    }
    if (order) {
        const orderKeys: string[] = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];
        const orders = await Order.find({}).select("_id");

        myCache.del(orderKeys);
    }
    if (admin) {

    }
}

export const reduceStock = async (orderItems: OrderItemType[]) => {
    for (let index = 0; index < orderItems.length; index++) {
        const order = orderItems[index];
        const product = await Product.findById(order.productId);
        if (!product) {
            throw new Error("Product not found");
        }
        product.stock -= order.quantity;
        await product.save();
    }
};