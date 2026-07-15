import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductDetailsAPI } from "../services/productService";
import { toast } from "sonner";

export const useProductDetailController = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState({
    product: null,
    relatedProducts: [],
  });

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ⚡ 1. THE CORRECTION FIX: Moved this function block ABOVE the useEffect hook
  // so it is officially declared before the lifecycle runtime attempts to call it.
  const trackRecentlyViewed = (product) => {
    if (!product) return;
    try {
      const cache = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      const filtered = cache.filter((p) => p._id !== product._id);
      filtered.unshift({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
      });
      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(filtered.slice(0, 4)),
      );
    } catch (e) {
      console.error("Local storage sync error", e);
    }
  };

  // ⚡ 2. The lifecycle fetch block can now safely reference trackRecentlyViewed
  useEffect(() => {
    const pullProductTimeline = async () => {
      setLoading(true);
      try {
        const data = await fetchProductDetailsAPI(productId);
        setPayload(data);

        if (data.product?.variants?.sizes?.length > 0)
          setSelectedSize(data.product.variants.sizes[0]);
        if (data.product?.variants?.colors?.length > 0)
          setSelectedColor(data.product.variants.colors[0]);

        // Triggers perfectly now with zero declaration errors
        trackRecentlyViewed(data.product);
      } catch (err) {
        toast.error(`Failed to map target inventory item data.${err}`);
      } finally {
        setLoading(false);
      }
    };

    pullProductTimeline();
  }, [productId]);

  const adjustQuantity = (amount, maxStock) => {
    const target = quantity + amount;
    if (target >= 1 && target <= maxStock) setQuantity(target);
  };

  return {
    ...payload,
    loading,
    activeImgIndex,
    setActiveImgIndex,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    quantity,
    adjustQuantity,
  };
};
