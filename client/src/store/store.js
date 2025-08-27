import { configureStore } from "@reduxjs/toolkit";

// Auth
import { authSlice } from "./auth/authSlice";
import { setStoreReference } from "../requestMethod";
import authStateReducer from "./auth/authStateSlice";

// Categories
import { categoriesSlice } from "./categories/categoriesSlice";
// Products
import { productsSlice } from "./products/productsSlice";
// Users
import { usersSlice } from "./users/usersSlice";
// Orders
import { ordersSlice } from "./orders/ordersSlice";
// Reviews
import { reviewsSlice } from "./reviews/reviewsSlice";
// Favourites
import { favouritesSlice } from "./favourites/favouritesSlice";

export const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authSlice.reducer,
    authState: authStateReducer,
    [categoriesSlice.reducerPath]: categoriesSlice.reducer,
    [productsSlice.reducerPath]: productsSlice.reducer,
    [usersSlice.reducerPath]: usersSlice.reducer,
    [ordersSlice.reducerPath]: ordersSlice.reducer,
    [reviewsSlice.reducerPath]: reviewsSlice.reducer,
    [favouritesSlice.reducerPath]: favouritesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authSlice.middleware)
      .concat(categoriesSlice.middleware)
      .concat(productsSlice.middleware)
      .concat(usersSlice.middleware)
      .concat(ordersSlice.middleware)
      .concat(reviewsSlice.middleware)
      .concat(favouritesSlice.middleware),
});

// Set store reference for axios interceptor
setStoreReference(store);
