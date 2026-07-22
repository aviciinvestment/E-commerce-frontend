import { useState, useEffect, useCallback } from "react";
import {
  getWishlistAPI,
  removeFromWishlistAPI,
} from "../services/wishlistService";
import { getUserId } from "../utils/getUserId";

export const useWishlistPageController = () => {
  const [products, setProducts] = useState([]);
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
        const json = await getWishlistAPI(userId);
        const list = json.data?.products || json.products || [];
        if (!cancelled) setProducts(list);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshIndex]);

  const refetch = useCallback(() => setRefreshIndex((i) => i + 1), []);

  const removeItem = async (productId) => {
    const userId = getUserId();
    if (!userId) return;

    setBusyIds((prev) => new Set(prev).add(productId));
    setProducts((prev) => prev.filter((p) => p._id !== productId));

    try {
      await removeFromWishlistAPI(userId, productId);
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
      refetch();
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  return { products, loading, busyIds, removeItem, refetch };
};
