import { useState, useCallback } from "react";
import { addToCartAPI } from "../services/cartService";
import { getUserId } from "../utils/getUserId";

export const useCartController = () => {
  const [cartBusyIds, setCartBusyIds] = useState(new Set());
  const [cartAddedIds, setCartAddedIds] = useState(new Set());

  const addToCart = useCallback(async (productId) => {
    const userId = getUserId();
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    setCartBusyIds((prev) => new Set(prev).add(productId));

    try {
      const json = await addToCartAPI(userId, productId, 1);
      if (!json.success) throw new Error(json.message || "Add to cart failed");

      // Brief "Added!" confirmation state
      setCartAddedIds((prev) => new Set(prev).add(productId));
      setTimeout(() => {
        setCartAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Couldn't add that item to your cart. Please try again.");
    } finally {
      setCartBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, []);

  return { cartBusyIds, cartAddedIds, addToCart };
};
