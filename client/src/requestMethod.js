import axios from "axios";

// const BASE_URL = "http://localhost:8080/api/";
const BASE_URL =
  "https://spring-boot-ecommerce-production-ab42.up.railway.app/api/";

const makeRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// We'll set this reference when store is created
let store;

export const setStoreReference = (storeRef) => {
  store = storeRef;
};

makeRequest.interceptors.request.use(
  (config) => {
    // Get token from Redux store instead of localStorage
    if (store) {
      const token = store.getState().authState.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await makeRequest({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
