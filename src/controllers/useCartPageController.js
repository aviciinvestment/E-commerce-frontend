import { useState, useEffect, useCallback } from "react";
import {
  getCartAPI,
  updateCartQuantityAPI,
  removeFromCartAPI,
} from "../services/cartService";
import { getUserId } from "../utils/getUserId";

export const useCartPageController = () => {
  const [cart, setCart] = useState({ items: [], cartTotal: 0 });
  // Start "loading" only if there's actually a user to fetch for
  const [loading, setLoading] = useState(() => !!getUserId());
  const [busyIds, setBusyIds] = useState(new Set());
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return; // nothing to fetch, loading was already initialized to false

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const json = await getCartAPI(userId);
        if (!cancelled) setCart(json.data || { items: [], cartTotal: 0 });
      } catch (err) {
        console.error("Failed to load cart", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshIndex]);

  const refetch = useCallback(() => setRefreshIndex((i) => i + 1), []);

  const changeQuantity = async (productId, newQuantity) => {
    const userId = getUserId();
    if (!userId || newQuantity < 1) return;

    setBusyIds((prev) => new Set(prev).add(productId));
    try {
      const json = await updateCartQuantityAPI(userId, productId, newQuantity);
      if (json.data) setCart(json.data);
    } catch (err) {
      console.error(
        "Failed to update quantity",
        err.response?.data || err.message,
      );
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const removeItem = async (productId) => {
    const userId = getUserId();
    if (!userId) return;

    setBusyIds((prev) => new Set(prev).add(productId));
    try {
      const json = await removeFromCartAPI(userId, productId);
      if (json.data) setCart(json.data);
    } catch (err) {
      console.error("Failed to remove item", err);
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  return { cart, loading, busyIds, changeQuantity, removeItem, refetch };
};
