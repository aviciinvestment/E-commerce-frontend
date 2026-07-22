import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com/cart";

const cartClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

cartClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const addToCartAPI = async (userId, productId, quantity = 1) => {
  const response = await cartClient.post("/cart/add", {
    userId,
    productId,
    quantity,
  });
  return response.data;
};

export const removeFromCartAPI = async (userId, productId) => {
  const response = await cartClient.post("/cart/remove", {
    userId,
    productId,
  });
  return response.data;
};

export const updateCartQuantityAPI = async (userId, productId, quantity) => {
  const response = await cartClient.put("/cart/update", {
    userId,
    productId,
    quantity,
  });
  return response.data;
};

export const getCartAPI = async (userId) => {
  const response = await cartClient.get(`/cart/${userId}`);
  return response.data;
};
