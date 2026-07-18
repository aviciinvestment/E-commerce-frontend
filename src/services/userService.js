import axios from "axios";

const BACKEND_DOMAIN = "https://e-commerce-backend-9wqm.onrender.com";

// 1. DEDICATED AUTH & PROFILE ROUTER BASE CLIENT
const authClient = axios.create({
  baseURL: `${BACKEND_DOMAIN}/user_Auth/`,
  headers: { "Content-Type": "application/json" },
});

// 2. DEDICATED ADDRESS MANAGEMENT ROUTER BASE CLIENT
const addressClient = axios.create({
  baseURL: `${BACKEND_DOMAIN}/address/`,
  headers: { "Content-Type": "application/json" },
});

// Sync secure JWT authentication tokens before every background query frame
const attachAuthInterceptor = (clientInstance) => {
  clientInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};
attachAuthInterceptor(authClient);
attachAuthInterceptor(addressClient);

/* ─────────────────────────────────────────────────────────
    EXPORTED NETWORK EXECUTORS ALIGNED TO YOUR ROUTER FILES
   ───────────────────────────────────────────────────────── */

// ✅ FIXED: Prepended 'address/' so it resolves to /address/address/:userId matching your exact backend route mapping!
export const fetchUserAddressesAPI = async (userId) => {
  const response = await addressClient.get(`address/${userId}`);
  return response.data;
};

// Add shipping allocation matching: POST /address/address/add
export const addUserAddressAPI = async (addressPayload) => {
  const response = await addressClient.post("address/add", addressPayload);
  return response.data;
};

// Update shipping parameters matching: PUT /address/address/update
export const updateUserAddressAPI = async (addressPayload) => {
  const response = await addressClient.put("address/update", addressPayload);
  return response.data;
};

// Purge address sub-document matching: POST /address/address/delete
export const deleteUserAddressAPI = async (addressId) => {
  const response = await addressClient.post("address/delete", { addressId });
  return response.data;
};

// Profile details updates matching: PUT /user_Auth/profile/update
export const updateAccountProfileAPI = async (fullname, email) => {
  const response = await authClient.put("profile/update", { fullname, email });
  return response.data;
};

// Passcode cryptographic mutations matching: POST /user_Auth/change-password
export const changeAccountPasswordAPI = async (
  currentPassword,
  newPassword,
) => {
  const response = await authClient.put("change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};
