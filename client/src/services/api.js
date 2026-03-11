import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === "/auth/refresh" || originalRequest.url === "/auth/login") {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem("velora_token", accessToken);
          setAuthToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("velora_token");
        setAuthToken(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const getProducts = async ({
  page = 1,
  limit = 12,
  category,
  minPrice,
} = {}) => {
  const query = buildQueryString({ page, limit, category, minPrice });
  const res = await api.get(`/products${query}`);
  return res.data.products;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data.product;
};

export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await api.post("/products", productData);
  return res.data;
};

export const registerUser = async (fields) => {
  const res = await api.post("/auth/register", fields);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data.cart || { products: [] };
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await api.post("/cart", { productId, quantity });
  return res.data.cart;
};

export const updateCart = async (products) => {
  const res = await api.put("/cart", { products });
  return res.data.cart;
};

export const removeFromCart = async (productId) => {
  const res = await api.delete(`/cart/${productId}`);
  return res.data.cart;
};

export default api;
