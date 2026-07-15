import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com";

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
  const response = await wishlistClient.post("/wishlist/wishlist/add", {
    userId,
    productId,
  });
  return response.data;
};

// 20. REMOVE FROM WISHLIST
export const removeFromWishlistAPI = async (userId, productId) => {
  const response = await wishlistClient.post("/wishlist/wishlist/remove", {
    userId,
    productId,
  });
  return response.data;
};

// 21. MOVE TO CART CROSS-HANDOFF PAYLOAD
export const moveWishlistItemToCartAPI = async (userId, productId) => {
  const response = await wishlistClient.post(
    "/wishlist/wishlist/move-to-cart",
    {
      userId,
      productId,
    },
  );
  return response.data;
};
