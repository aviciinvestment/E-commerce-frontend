import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com/products";

const productClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

productClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getSingleProductAPI = async (productId) => {
  const response = await productClient.get(`/getSingleProduct/${productId}`);
  return response.data;
};
