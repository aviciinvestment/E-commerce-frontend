import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUserAPI } from "../services/AuthService";
import { toast } from "sonner";

export const useLoginController = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 5. USER LOGIN FLOW PROCESSOR
  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUserAPI(email, password);

      // Save your secure authorization access token safely to local storage
      localStorage.setItem("accessToken", data.token);

      // Fire richColor success alert instantly using user object values
      toast.success(`Welcome back, ${data.user?.fullname || "User"}!`);

      // Push shopper securely inside the authenticated ecosystem dashboard
      navigate("/dashboard");
    } catch (err) {
      const fallbackError =
        err.response?.data?.message || "Invalid username or password match.";
      toast.error(fallbackError);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading };
};
