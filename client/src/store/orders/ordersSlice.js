import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const ordersSlice = createApi({
  reducerPath: "ordersApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/orders" }),
  tagTypes: ["Order"],

  endpoints: (builder) => ({
    // Create new Order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "",
        method: "POST",
        data: orderData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Order"],
    }),

    // Get all orders with pagination
    getOrders: builder.query({
      query: ({ page = 1, size = 10 } = {}) => ({
        url: `?page=${page}&size=${size}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          data: response.data,
          status: response.status,
          errors: response.errors,
        };
      },
      providesTags: ["Order"],
    }),

    // Get single Order by ID
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `/${orderId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    // Update Order
    updateOrder: builder.mutation({
      query: ({ orderId, ...orderData }) => ({
        url: `/${orderId}`,
        method: "PUT",
        data: orderData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        "Order",
      ],
    }),

    // Order Payment
    orderPayment: builder.mutation({
      query: ({ ...orderData }) => ({
        url: `/payment`,
        method: "PUT",
        data: orderData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Order"],
    }),

    // Delete Order
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/${orderId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["Order"],
    }),

    // Get all for Specific ((USER))
    getOrdersByUser: builder.query({
      query: (userId) => ({
        url: `/${userId}/user`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || [];
      },
      providesTags: (result, error, userId) => [
        { type: "Order", id: `USER_${userId}` },
        "Order",
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useOrderPaymentMutation,
  useDeleteOrderMutation,
  useGetOrdersByUserQuery,
} = ordersSlice;
