import { useState, useEffect, useCallback } from "react";
import {
  addToWishlistAPI,
  removeFromWishlistAPI,
  getWishlistAPI,
} from "../services/wishlistService";
import { getUserId } from "../utils/getUserId";

export const useWishlistController = () => {
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistBusyIds, setWishlistBusyIds] = useState(new Set());

  // Fetch the user's existing wishlist once, so hearts render correctly filled in
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const fetchWishlist = async () => {
      try {
        const json = await getWishlistAPI(userId);
        const list = json.data?.products || json.products || [];
        const ids = new Set(
          list.map((p) => (typeof p === "string" ? p : p._id)),
        );
        setWishlistIds(ids);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = useCallback(
    async (productId) => {
      const userId = getUserId();
      if (!userId) {
        alert("Please log in to save items to your wishlist.");
        return;
      }

      const isWishlisted = wishlistIds.has(productId);

      setWishlistBusyIds((prev) => new Set(prev).add(productId));
      // Optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        isWishlisted ? next.delete(productId) : next.add(productId);
        return next;
      });

      try {
        const json = isWishlisted
          ? await removeFromWishlistAPI(userId, productId)
          : await addToWishlistAPI(userId, productId);
        if (!json.success)
          throw new Error(json.message || "Wishlist update failed");
      } catch (err) {
        console.error(err);
        // Roll back on failure
        setWishlistIds((prev) => {
          const next = new Set(prev);
          isWishlisted ? next.add(productId) : next.delete(productId);
          return next;
        });
      } finally {
        setWishlistBusyIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
    },
    [wishlistIds],
  );

  return { wishlistIds, wishlistBusyIds, toggleWishlist };
};
