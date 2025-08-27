import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const productsSlice = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/products" }),
  tagTypes: ["Product"],

  endpoints: (builder) => ({
    // Get all products with pagination
    getProducts: builder.query({
      query: ({ page = 1, size = 10 } = {}) => ({
        url: `?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // Return the full response structure to access pagination info and content
        return {
          data: response.data,
          status: response.status,
          errors: response.errors,
        };
      },
      providesTags: ["Product"],
    }),

    // Get single Product by ID
    getProductById: builder.query({
      query: (productId) => ({
        url: `/${productId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    // Create new Product
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "",
        method: "POST",
        data: productData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Product"],
    }),

    // Update Product
    updateProduct: builder.mutation({
      query: ({ productId, ...productData }) => ({
        url: `/${productId}`,
        method: "PUT",
        data: productData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        "Product",
      ],
    }),

    // Delete Product
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/${productId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsSlice;
