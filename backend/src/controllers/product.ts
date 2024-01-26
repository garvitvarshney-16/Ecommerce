import { rm } from "fs";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utilityclass.js";
import { BaseQuery } from "../types/types.js";
import { faker, tr } from "@faker-js/faker"
import { myCache } from "../app.js";
import { invalidatesCache } from "../utils/feature.js";




// Revalidate on New, update, delete product & on new order
export const getLatestProducts = TryCatch(async (req, res, next) => {
    let products;

    if (myCache.has("latest-product")) {
        products = JSON.parse(myCache.get("latest-product") as string);
    } else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-products", JSON.stringify(products))
    }

    return res.status(200).json({
        success: true,
        products,
    });
});

// Revalidate on New, update, delete product & on new order
export const getAllCategories = TryCatch(async (req, res, next) => {

    let categories;

    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories") as string)
    } else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories))
    }

    return res.status(200).json({
        success: true,
        categories,
    })
})

// Revalidate on New, update, delete product & on new order
export const getAdminProducts = TryCatch(async (req, res, next) => {

    let products;

    if (myCache.has("all-products")) {
        products = JSON.parse(myCache.get("all-products") as string);
    } else {
        products = await Product.find({})
        myCache.set("all-products", JSON.stringify(products));
    }


    return res.status(200).json({
        success: true,
        products,
    })
})

export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;

    if (myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`) as string);
    } else {
        product = await Product.findById(id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        myCache.set(`product-${id}`, JSON.stringify(product))

    }

    return res.status(200).json({
        success: true,
        product,
    })
})


export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) {
        return next(new ErrorHandler("Please Add Photo", 400));
    }

    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("Deleted");
        })
        return next(new ErrorHandler("Please Add All Fields", 400));
    }

    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo?.path,
    })

    await invalidatesCache({product: true})

    return res.status(201).json({
        success: true,
        message: "Product Created Successfully",
    })
});

export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);

    if (!product) {
        return next(new ErrorHandler("Invalid Product id", 404));
    }

    if (photo) {
        rm(product.photo!, () => {
            console.log("Old photo deleted");
        });
        product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    await invalidatesCache({product: true, productId: String(product._id)})

    return res.status(200).json({
        success: true,
        message: "Product Updated successfully"
    })
})

export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    rm(product.photo!, () => {
        console.log("Product photo deleted");
    });

    await Product.deleteOne();

    await invalidatesCache({product: true, productId: String(product._id)})

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    })
})


export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    // 1,2,3,4,5,6,7,8
    // 9,10,11,12,13,14,16
    // 17,18,19,20,21,22,23,24 skip
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);

    const baseQuery: BaseQuery = {};

    if (search)
        baseQuery.name = {
            $regex: String(search),
            $options: "i",
        };

    if (price)
        baseQuery.price = {
            $lte: Number(price),
        }

    if (category) {
        baseQuery.category = String(category);
    }

    const productsPromise = await Product.find(baseQuery).sort(
        sort && { price: sort === "asc" ? 1 : -1 }
    ).limit(limit).skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ])

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit)

    return res.status(200).json({
        success: true,
        products,
        totalPage,
    })
})

// const generaterandomProducts = async (count: number = 10) => {
//     const products= [];

//     for(let i = 0; i < count; i++){
//         const product = {
//             name: faker.commerce.productName(),
//             photo: "upload\\8a8d1e5f-d439-4845-ae91-24c0b4007483.jpg",
//             price: faker.commerce.price({min: 1500, max: 80000, dec: 0}),
//             stock: faker.commerce.price({min: 0, max: 100, dec: 0}),
//             category: faker.commerce.department(),
//             createdAt: new Date(faker.date.past()),
//             updatedAt: new Date(faker.date.recent()),
//             __v: 0,
//         };
//         products.push(product);

//     }

//     await Product.create(products);

//     console.log({success: true});
// }

// const deleteRandomProducts =async (count: number = 10) => {
//     const products = await Product.find({}).skip(2);

//     for(let i = 0; i < products.length; i++){
//         const product = products[i];
//         await product.deleteOne();
//     }

//     console.log({success: true});
// }

// deleteRandomProducts()