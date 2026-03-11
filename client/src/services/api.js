import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getProducts = async (page = 1, limit = 10) => {
  const res = await api.get(`/products?page=${page}&limit=${limit}`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export default api;