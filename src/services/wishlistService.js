import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com/wishlist";

const wishlistClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

wishlistClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 18. ADD TO WISHLIST
export const addToWishlistAPI = async (userId, productId) => {
  const response = await wishlistClient.post("/wishlist/add", {
    userId,
    productId,
  });
  return response.data;
};

export const removeFromWishlistAPI = async (userId, productId) => {
  const response = await wishlistClient.post("/wishlist/remove", {
    userId,
    productId,
  });
  return response.data;
};

export const getWishlistAPI = async (userId) => {
  const response = await wishlistClient.get(`/wishlist/${userId}`);
  return response.data;
};
