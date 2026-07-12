import axios from "axios";

// ⚡ Replace this with your actual live Render deployment backend URL!
const API_BASE_URL = "https://e-commerce-backend-9wqm.onrender.com";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically inject your JWT bearer token into every single outgoing secure request header
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUserAPI = async (fullname, email, password, role) => {
  console.log(fullname, email, password, role);
  const response = await authClient.post("/user_Auth/createAccount", {
    fullname,
    email,
    password,
    // ⚡ Enforce 'customer' to pass your backend schema's strict enum check
    role: role === "user" ? "customer" : role || "customer",
  });
  return response.data;
};

// Append this function inside your src/services/authService.js file
export const verifyEmailAPI = async (token, email) => {
  // Hits your backend router endpoint to flip isVerified to true in MongoDB
  const response = await authClient.get(
    `/user_Auth/verify-email?token=${token}&email=${email}`,
  );
  return response.data;
};

export const loginUserAPI = async (email, password) => {
  const response = await authClient.post("/user_Auth/login", {
    email,
    password,
  });
  return response.data;
};

export const fetchUserProfileAPI = async () => {
  const response = await authClient.get("/user_Auth/profile");
  return response.data;
};

export const forgotPasswordAPI = async (email) => {
  const response = await authClient.post("/user_Auth/forgot-password", {
    email,
  });
  return response.data;
};
