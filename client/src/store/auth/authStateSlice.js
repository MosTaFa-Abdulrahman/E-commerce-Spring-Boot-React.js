import { createSlice } from "@reduxjs/toolkit";

// Helper functions for secure token storage (using localStorage temporarily)
const loadTokenFromStorage = () => {
  try {
    const token = localStorage.getItem("auth_token");
    return token || null;
  } catch (err) {
    return null;
  }
};

const saveTokenToStorage = (token) => {
  try {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  } catch (err) {}
};

const initialState = {
  user: null,
  token: loadTokenFromStorage(), // Load token on app startup
  isAuthenticated: false,
};

const authStateSlice = createSlice({
  name: "authState",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      // Save token to storage for persistence
      saveTokenToStorage(token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Clear token from storage
      saveTokenToStorage(null);
    },
    // NEW: Set only user info (when token is already stored)
    setUserInfo: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { setCredentials, logout, setUserInfo } = authStateSlice.actions;
export default authStateSlice.reducer;
