import { useState, useEffect } from "react";
import {
  getOrderDetailsAPI,
  requestReturnRefundAPI,
} from "../services/orderService";
import { getUserId } from "../utils/getUserId";

export const useOrderDetailsController = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const json = await getOrderDetailsAPI(orderId);
        if (!cancelled) {
          if (json.success) setOrder(json.data);
          else setError(json.message || "Order not found.");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Couldn't load this order.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const requestReturn = async () => {
    const userId = getUserId();
    if (!userId || !orderId) return;

    setActionLoading(true);
    try {
      const json = await requestReturnRefundAPI(userId, orderId);
      if (json.success && json.data) setOrder(json.data);
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Couldn't submit return request. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return { order, loading, error, actionLoading, requestReturn };
};
