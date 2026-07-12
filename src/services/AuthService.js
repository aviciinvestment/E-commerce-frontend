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
  // Directly transmits your { email, password } request object
  const response = await authClient.post("/user_Auth/login", {
    email,
    password,
  });
  return response.data;
};

// Add this export alongside your other API calls inside src/services/authService.js
export const forgotPasswordAPI = async (email) => {
  // Transmits exactly { email } matching your backend req.body.email requirement
  const response = await authClient.post("/user_Auth/forgotpassword", {
    email,
  });
  return response.data;
};

// Append this function inside your src/services/authService.js file
export const resetPasswordAPI = async (
  token,
  email,
  first_password,
  second_password,
) => {
  // Directly transmits the exact keys expected by your backend req.body
  const response = await authClient.post(
    `/user_Auth/resetpassword?token=${token}&email=${email}`,
    {
      first_password,
      second_password,
    },
  );
  return response.data;
};
