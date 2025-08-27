import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const favouritesSlice = createApi({
  reducerPath: "favouritesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/favourites" }),
  tagTypes: ["Favourites"],

  endpoints: (builder) => ({
    // Create
    createFavourite: builder.mutation({
      query: (favouritesData) => ({
        url: "",
        method: "POST",
        data: favouritesData,
      }),
      invalidatesTags: ["Favourites"],
    }),

    // Get single favourite by ID
    getFavouriteById: builder.query({
      query: (favouriteId) => ({
        url: `/${favouriteId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error, favouriteId) => [
        { type: "Favourites", id: favouriteId },
      ],
    }),

    // Delete
    deleteFavourite: builder.mutation({
      query: (favouriteId) => ({
        url: `/${favouriteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favourites"],
    }),

    // Get all for Specific ((USER))
    getFavouritesByUser: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || [];
      },
      providesTags: (result, error, userId) => [
        { type: "Favourites", id: `USER_${userId}` },
        "Favourites",
      ],
    }),
  }),
});

export const {
  useCreateFavouriteMutation,
  useGetFavouriteByIdQuery,
  useDeleteFavouriteMutation,
  useGetFavouritesByUserQuery,
} = favouritesSlice;
