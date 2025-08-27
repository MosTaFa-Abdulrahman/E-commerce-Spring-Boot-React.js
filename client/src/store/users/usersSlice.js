import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const usersSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/users" }),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    // Get all users with pagination
    getUsers: builder.query({
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
      providesTags: ["User"],
    }),

    // Get single User by ID
    getUserById: builder.query({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    // Update User
    updateUser: builder.mutation({
      query: ({ userId, ...userData }) => ({
        url: `/${userId}`,
        method: "PUT",
        data: userData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
        "User",
      ],
    }),

    // Delete User
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/${userId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersSlice;
