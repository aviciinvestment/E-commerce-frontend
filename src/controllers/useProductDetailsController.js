import { useState, useEffect, useCallback, useMemo } from "react";
import { getSingleProductAPI } from "../services/productDetailService";
import {
  createReviewAPI,
  updateReviewAPI,
  deleteReviewAPI,
  getProductReviewsAPI,
} from "../services/reviewService";
import { getUserId } from "../utils/getUserId";

export const useProductDetailsController = (productId) => {
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Fetch the product itself
  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    (async () => {
      setProductLoading(true);
      try {
        const json = await getSingleProductAPI(productId);
        // GetSingleProduct returns the product directly, not wrapped in { data }
        if (!cancelled) setProduct(json);
      } catch (err) {
        if (!cancelled) {
          setProductError(err.response?.data?.message || "Product not found.");
        }
      } finally {
        if (!cancelled) setProductLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Fetch reviews for the product
  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    (async () => {
      setReviewsLoading(true);
      try {
        const json = await getProductReviewsAPI(productId);
        if (!cancelled) setReviews(json.data || []);
      } catch (err) {
        console.error(
          "Failed to load reviews",
          err.response?.data || err.message,
        );
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId, refreshIndex]);

  const refetchReviews = useCallback(() => setRefreshIndex((i) => i + 1), []);

  // The logged-in user's own review, if they've already written one
  const myReview = useMemo(() => {
    const userId = getUserId();
    if (!userId) return null;
    return reviews.find((r) => (r.userId?._id || r.userId) === userId) || null;
  }, [reviews]);

  const submitReview = async (rating, comment) => {
    const userId = getUserId();
    if (!userId) {
      alert("Please log in to write a review.");
      return false;
    }

    setReviewSubmitting(true);
    try {
      if (myReview) {
        await updateReviewAPI(myReview._id, userId, rating, comment);
      } else {
        await createReviewAPI(userId, productId, rating, comment);
      }
      refetchReviews();
      return true;
    } catch (err) {
      console.error(
        "Failed to submit review",
        err.response?.data || err.message,
      );
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Couldn't submit your review. Please try again.",
      );
      return false;
    } finally {
      setReviewSubmitting(false);
    }
  };

  const removeMyReview = async () => {
    const userId = getUserId();
    if (!userId || !myReview) return;

    setReviewSubmitting(true);
    try {
      await deleteReviewAPI(myReview._id, userId);
      refetchReviews();
    } catch (err) {
      console.error(
        "Failed to delete review",
        err.response?.data || err.message,
      );
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Couldn't delete your review. Please try again.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  return {
    product,
    productLoading,
    productError,
    reviews,
    reviewsLoading,
    reviewSubmitting,
    myReview,
    submitReview,
    removeMyReview,
  };
};
