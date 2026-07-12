import { useState, useEffect, useRef } from "react";
import {
  fetchCompleteDashboardAPI,
  cancelOrderAPI,
} from "../services/userService";
import { toast } from "sonner";

export const useDashboardController = () => {
  const mockUserId = "60d5ec494a822211116b4321"; // Replace with your JWT context decoder later
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [storeData, setStoreData] = useState({
    profile: null,
    orders: [],
    cart: null,
    addresses: [],
    wishlist: [],
  });

  // Guard flag to block strict-mode from double-triggering state re-renders synchronously
  const hasExecutedRef = useRef(false);

  // Isolate your dashboard loader function
  const pullDashboardPayload = async () => {
    try {
      const payload = await fetchCompleteDashboardAPI(mockUserId);

      // ⚡ The fix: Updating state inside an resolved async block pushes
      // execution to the microtask queue, avoiding synchronous layout collisions.
      setStoreData(payload);
    } catch (err) {
      toast.error(`Error communicating with data servers.${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent double execution loops in React dev profiles
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      pullDashboardPayload();
    }
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrderAPI(orderId, mockUserId);
      toast.success("Order cancelled successfully.");
      await pullDashboardPayload(); // Seamlessly update data fields across layout tables
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation window closed.");
    }
  };

  return { storeData, loading, activeTab, setActiveTab, handleCancelOrder };
};
