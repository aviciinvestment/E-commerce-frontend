import { useState, useEffect, useCallback } from "react";
import { getUserOrdersAPI, cancelOrderAPI } from "../services/orderService";
import { getUserId } from "../utils/getUserId";

export const useOrderHistoryController = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(() => !!getUserId());
  const [busyIds, setBusyIds] = useState(new Set());
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const json = await getUserOrdersAPI(userId);
        if (!cancelled) setOrders(json.data || []);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshIndex]);

  const refetch = useCallback(() => setRefreshIndex((i) => i + 1), []);

  const cancelOrder = async (orderId) => {
    const userId = getUserId();
    if (!userId) return;

    setBusyIds((prev) => new Set(prev).add(orderId));
    try {
      const json = await cancelOrderAPI(userId, orderId);
      if (json.success && json.data) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? json.data : o)),
        );
      }
    } catch (err) {
      console.error("Failed to cancel order", err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Couldn't cancel this order. Please try again.",
      );
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  return { orders, loading, busyIds, cancelOrder, refetch };
};
