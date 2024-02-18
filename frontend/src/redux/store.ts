import { configureStore } from "@reduxjs/toolkit"
import { userAPI } from "./api/userApi"
import { userReducer } from "./reducer/userReducer";
import { productApi } from "./api/productApi";

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [userReducer.name]: userReducer.reducer,
    },
    middleware: (mid) => mid().concat(userAPI.middleware, productApi.middleware),
});