import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, CategoriesResponse, DeleteProductRequest, MessageResponse, NewProductRequest, ProductDetailsRequest, ProductResponse, SearchProductsRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/api-types";


export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
    }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductsResponse, string>({
            query: () => "latest",
            providesTags: ['product'],
        }),
        allProducts: builder.query<AllProductsResponse, string>({
            query: (id) => `admin-products?id=${id}`,
            providesTags: ['product'],
        }),
        categories: builder.query<CategoriesResponse, string>({
            query: () => `categories`,
            providesTags: ['product'],
        }),
        searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
            query: ({ price, search, sort, category, page }) => {
                let base = `all?search=${search}&page=${page}`;

                if (price) base += `&price=${price}`;
                if (sort) base += `&sort=${sort}`;
                if (category) base += `&category=${category}`;

                return base
            },
            providesTags: ['product'],
        }),
        productDetails: builder.query<ProductResponse, ProductDetailsRequest>({
            query: ({ id, userId }) => {
                const queryString = `${id}?id=${userId}`;
                return queryString;
            },
            providesTags: ["product"],
        }),
        newProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({ formData, id }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ['product']
        }),
        updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
            query: ({ formData, userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ['product']
        }),
        deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
            query: ({userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['product']
        })
    }),
})

export const { useLatestProductsQuery, useAllProductsQuery, useCategoriesQuery, useSearchProductsQuery, useNewProductMutation, useProductDetailsQuery, useUpdateProductMutation, useDeleteProductMutation } = productApi;