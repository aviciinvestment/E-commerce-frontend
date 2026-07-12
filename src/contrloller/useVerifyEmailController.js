import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmailAPI } from "../services/AuthService";
import { toast } from "sonner";

export const useVerifyEmailController = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Verifying your credentials...");

  // Prevents strict mode from executing the API call twice simultaneously
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    // 2. Define the asynchronous execution worker block
    const executeVerification = async () => {
      // Guard Check: Verify parameters are valid before contacting your Render backend
      if (!token || !email) {
        setStatus("error");
        setMessage("Invalid or missing verification parameters.");
        return;
      }

      try {
        const data = await verifyEmailAPI(token, email);
        setStatus("success");
        setMessage(
          data.message || "Your email address has been verified successfully!",
        );
        toast.success("Account Activated!");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification link has expired or is invalid.",
        );
        toast.error("Activation Failed");
      }
    };

    // Prevent double execution loops in React dev profiles
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      executeVerification();
    }
  }, [searchParams]);

  return { status, message };
};
