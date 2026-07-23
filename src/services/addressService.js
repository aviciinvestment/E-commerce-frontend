import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com/address";

const addressClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

addressClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const addAddressAPI = async (userId, addressData) => {
  const response = await addressClient.post("/address/add", {
    userId,
    ...addressData,
  });
  return response.data;
};

export const updateAddressAPI = async (userId, addressId, addressData) => {
  const response = await addressClient.put("/address/update", {
    userId,
    addressId,
    ...addressData,
  });
  return response.data;
};

export const deleteAddressAPI = async (userId, addressId) => {
  const response = await addressClient.post("/address/delete", {
    userId,
    addressId,
  });
  return response.data;
};

export const getUserAddressesAPI = async (userId) => {
  const response = await addressClient.get(`/address/${userId}`);
  return response.data;
};
