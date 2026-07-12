import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerUserAPI,
  loginUserAPI,
  //fetchUserProfileAPI,
} from "../services/AuthService";

export const useAuthController = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 4. USER REGISTRATION HANDLER
  const handleRegister = async (fullname, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      await registerUserAPI(fullname, email, password, role);
      navigate("/email-sent"); // Redirect to log in screen on creation success
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // 5 & 7. USER LOGIN & JWT AUTHENTICATION HANDLER
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUserAPI(email, password);

      // Save your secure authorization access token token safely to memory storage
      localStorage.setItem("accessToken", data.token);
      setUser(data.user);

      navigate("/dashboard"); // Route user inside the secure ecosystem shell
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid username or password match.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  };

  return { user, loading, error, handleRegister, handleLogin, handleLogout };
};
