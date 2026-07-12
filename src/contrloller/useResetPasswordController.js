import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordAPI } from "../services/AuthService";
import { toast } from "sonner";

export const useResetPasswordController = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (first_password, second_password) => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    // 1. Guard Rail: Ensure parameters exist in the URL string
    if (!token || !email) {
      toast.error("Malformed request. Security link parameters are missing.");
      return;
    }

    // 2. Guard Rail: Client-side match validation validation check
    if (first_password !== second_password) {
      toast.error("Passwords do not match. Please re-type your entry fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPasswordAPI(
        token,
        email,
        first_password,
        second_password,
      );

      toast.success(data.message || "Password updated cleanly! Please log in.");
      navigate("/login"); // Move user back to the gatehouse entrance cleanly
    } catch (err) {
      const fallbackError =
        err.response?.data?.message || "Token has expired or is invalid.";
      toast.error(fallbackError);
    } finally {
      setLoading(false);
    }
  };

  return { handleResetPassword, loading };
};
