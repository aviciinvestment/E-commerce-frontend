import axios from "axios";

const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com";

const profileClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically inject your secure JWT bearer token into every single profile request header
profileClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const updateAccountProfileAPI = async (fullname, email) => {
  const response = await profileClient.put("/user_Auth/profile/update", {
    fullname,
    email,
  });
  return response.data;
};

export const changeAccountPasswordAPI = async (
  current_password,
  new_password,
) => {
  const response = await profileClient.post("/user_Auth/change-password", {
    current_password,
    new_password,
  });
  return response.data;
};

export const deleteUserAddressAPI = async (addressId) => {
  const response = await profileClient.delete(
    `/address/address/delete/${addressId}`,
  );
  return response.data;
};
