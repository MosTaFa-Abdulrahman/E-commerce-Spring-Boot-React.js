import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const categoriesSlice = createApi({
  reducerPath: "categoriesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/categories" }),
  tagTypes: ["Category"],

  endpoints: (builder) => ({
    // Get all categories
    getCategories: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || [];
      },
      providesTags: ["Category"],
    }),

    // Get single category by ID
    getCategoryById: builder.query({
      query: (categoryId) => ({
        url: `/${categoryId}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      providesTags: (result, error, categoryId) => [
        { type: "Category", id: categoryId },
      ],
    }),

    // Create new category
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: "",
        method: "POST",
        data: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),

    // Update category
    updateCategory: builder.mutation({
      query: ({ categoryId, ...categoryData }) => ({
        url: `/${categoryId}`,
        method: "PUT",
        data: categoryData,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: "Category", id: categoryId },
        "Category",
      ],
    }),

    // Delete category
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesSlice;
