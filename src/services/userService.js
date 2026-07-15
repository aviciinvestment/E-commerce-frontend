import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com";

const userClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically inject your secure JWT bearer token into every single profile call
userClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCompleteDashboardAPI = async (userId) => {
  // Parallel execution runs all 5 endpoint queries concurrently in a single microtask frame
  const [profileRes, ordersRes, cartRes, addressesRes, wishlistRes] =
    await Promise.all([
      userClient.get(`/user_Auth/profile/${userId}`),
      userClient.get(`/order/orders/user/${userId}`),
      userClient.get(`/cart/cart/${userId}`),
      userClient.get(`/address/address/${userId}`),
      userClient.get(`/wishlist/wishlist/${userId}`),
    ]);

  return {
    profile: profileRes.data?.data || null,
    orders: ordersRes.data?.data || [],
    cart: cartRes.data?.data || { items: [] },
    addresses: addressesRes.data?.data || [],
    wishlist: wishlistRes.data?.data || [],
  };
};
