import axios from "axios";

// ⚠️ Mounted at /order (singular), but every route inside is prefixed /orders (plural)
const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com/order";

const orderClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

orderClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const confirmPaymentAndPlaceOrderAPI = async (
  userId,
  orderId,
  paymentReference,
) => {
  const response = await orderClient.post("/orders/confirm", {
    userId,
    orderId,
    paymentReference,
  });
  return response.data;
};

export const getUserOrdersAPI = async (userId) => {
  const response = await orderClient.get(`/orders/user/${userId}`);
  return response.data;
};

export const getOrderDetailsAPI = async (orderId) => {
  const response = await orderClient.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrderAPI = async (userId, orderId) => {
  const response = await orderClient.put("/orders/cancel", {
    userId,
    orderId,
  });
  return response.data;
};

export const requestReturnRefundAPI = async (userId, orderId) => {
  const response = await orderClient.post("/orders/return-request", {
    userId,
    orderId,
  });
  return response.data;
};
