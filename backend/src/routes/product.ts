import Express from "express";
import { singleUpload } from "../middlewares/multer.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";

const app = Express()

// create new products - /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);
// to get all products with filters -
app.get("/all", getAllProducts) 
// to get last 5 products - /api/v1/product/latest
app.get("/latest", getLatestProducts);
// to get all unique categories - /api/v1/product/categories
app.get("/categories", getAllCategories);
// to get all products - /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);

// to get , update , delete products
app.route("/:id").get(adminOnly, getSingleProduct).put(adminOnly, singleUpload, updateProduct).delete(adminOnly, deleteProduct)

export default app;