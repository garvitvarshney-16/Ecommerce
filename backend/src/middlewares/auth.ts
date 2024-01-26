import { User } from "../models/user.js";
import ErrorHandler from "../utils/utilityclass.js";
import { TryCatch } from "./error.js";

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
    const {id} = req.query;

    if (!id) {
        return next(new ErrorHandler("Not log in", 401));
    }

    const user = await User.findById(id);

    if (!user) {
        return next(new ErrorHandler("Id invalid", 401));
    }

    if (user.role !== "admin") {
        return next(new ErrorHandler("You are not admin", 401));
    }

    next();
})