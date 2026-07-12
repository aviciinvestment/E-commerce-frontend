import axios from "axios";

const API_BASE_URL = "https://onrender.com";

const userClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

userClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchCompleteDashboardAPI = async (userId) => {
  // Parallel execution pulls all backend module timelines concurrently
  const [profileRes, ordersRes, cartRes, addressesRes, wishlistRes] =
    await Promise.all([
      userClient.get(`/user_Auth/profile/${userId}`),
      userClient.get(`/orders/user/${userId}`),
      userClient.get(`/cart/${userId}`),
      userClient.get(`/addresses/${userId}`),
      userClient.get(`/wishlist/${userId}`),
    ]);

  return {
    profile: profileRes.data.data,
    orders: ordersRes.data.data || [],
    cart: cartRes.data.data,
    addresses: addressesRes.data.data || [],
    wishlist: wishlistRes.data.data || [],
  };
};

export const cancelOrderAPI = async (orderId, userId) => {
  const response = await userClient.put("/orders/cancel", { orderId, userId });
  return response.data;
};
