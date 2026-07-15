import { useState } from "react";
import {
  addToWishlistAPI,
  removeFromWishlistAPI,
  moveWishlistItemToCartAPI,
} from "../services/wishlistService";
import { toast } from "sonner";

export const useWishlistController = (onRefreshDashboard) => {
  const mockUserId = "60d5ec494a822211116b4321"; // Decoded from JWT in production
  const [wishlistActionLoading, setWishlistActionLoading] = useState(false);

  // 18 & 20. TOGGLE WISHLIST STATE ENTRY
  const handleToggleWishlist = async (productId, isFavored) => {
    setWishlistActionLoading(true);
    try {
      if (isFavored) {
        await removeFromWishlistAPI(mockUserId, productId);
        toast.success("Purged from wishlist favorite tracks.");
      } else {
        await addToWishlistAPI(mockUserId, productId);
        toast.success("Saved to personal interest wishlist!");
      }
      if (onRefreshDashboard) await onRefreshDashboard(); // Re-sync data grids
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Wishlist transaction rejected.",
      );
    } finally {
      setWishlistActionLoading(false);
    }
  };

  // 21. MOVE WISHLIST ITEM TO CART PIPELINE
  const handleMoveToCart = async (productId) => {
    setWishlistActionLoading(true);
    try {
      const res = await moveWishlistItemToCartAPI(mockUserId, productId);
      toast.success(
        res.message || "Cargo allocation moved to shopping cart cleanly!",
      );
      if (onRefreshDashboard) await onRefreshDashboard();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to transfer item to cart basket.",
      );
    } finally {
      setWishlistActionLoading(false);
    }
  };

  return { handleToggleWishlist, handleMoveToCart, wishlistActionLoading };
};
