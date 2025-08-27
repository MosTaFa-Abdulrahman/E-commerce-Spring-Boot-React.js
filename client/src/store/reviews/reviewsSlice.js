import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const reviewsSlice = createApi({
  reducerPath: "reviewsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/reviews" }),
  tagTypes: ["Review"],

  endpoints: (builder) => ({
    // Create new Review
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "",
        method: "POST",
        data: reviewData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Review"],
    }),

    // Delete Review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/${reviewId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Review"],
    }),

    // Get all for Specific Product
    getReviewsByProduct: builder.query({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || [];
      },
      providesTags: (result, error, productId) => [
        { type: "Review", id: `PRODUCT_${productId}` },
        "Review",
      ],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByProductQuery,
} = reviewsSlice;
