import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: axiosBaseQuery({ baseUrl: "auth" }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: "/register",
        method: "POST",
        data: user,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        data: credentials,
      }),
      transformResponse: (response) => {
        return {
          user: {
            userId: response.data.userId,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role,
          },
          token: response.data.token,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    checkAuth: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          user: {
            userId: response.data.userId,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role,
          },
        };
      },
      providesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useCheckAuthQuery,
  useLogoutMutation,
} = authSlice;
