import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com/checkout";

const checkoutClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

checkoutClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ⚠️ Matches the backend's double-prefix convention: mounted at /checkout,
// route defined as /checkout/session → real path /checkout/checkout/session
export const createCheckoutSessionAPI = async (
  userId,
  addressId,
  couponCode,
) => {
  const response = await checkoutClient.post("/checkout/session", {
    userId,
    addressId,
    couponCode: couponCode || undefined,
  });
  return response.data;
};
