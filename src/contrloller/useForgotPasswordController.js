import { useState } from "react";
import { forgotPasswordAPI } from "../services/AuthService";
import { toast } from "sonner";

export const useForgotPasswordController = () => {
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleForgotPassword = async (email) => {
    setLoading(true);
    try {
      const data = await forgotPasswordAPI(email.trim());

      setIsEmailSent(true);
      toast.success(data.message || "Password reset instructions dispatched!");
    } catch (err) {
      const fallbackError =
        err.response?.data?.message || "Failed to request password reset link.";
      toast.error(fallbackError);
    } finally {
      setLoading(false);
    }
  };

  return { handleForgotPassword, loading, isEmailSent };
};
