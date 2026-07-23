import axios from "axios";

// ⚠️ Mounted at /payment, routes also prefixed /payment/... → real path /payment/payment/...
const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com/payment";

const paymentClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

paymentClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const startPaymentAPI = async (orderId, gateway = "paystack") => {
  const response = await paymentClient.post("/payment/initialize", {
    orderId,
    gateway,
  });
  return response.data;
};

export const getReceiptAPI = async (orderId) => {
  const response = await paymentClient.get(`/payment/receipt/${orderId}`);
  return response.data;
};
