import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductDetailsController } from "../controllers/useProductDetailsController";
import { useWishlistController } from "../controllers/useWishlistController";
import { useCartController } from "../controllers/useCartController";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Loader2,
  Check,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  MessageSquare,
} from "lucide-react";

const StarRating = ({ value, size = "w-4 h-4" }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`${size} ${
          n <= Math.round(value)
            ? "fill-amber-400 text-amber-400"
            : "text-slate-200"
        }`}
      />
    ))}
  </div>
);

const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="p-0.5"
        aria-label={`Rate ${n} stars`}
      >
        <Star
          className={`w-6 h-6 transition-colors ${
            n <= value
              ? "fill-amber-400 text-amber-400"
              : "text-slate-200 hover:text-amber-200"
          }`}
        />
      </button>
    ))}
  </div>
);

export const ProductDetailsView = () => {
  const { productId } = useParams();
  const {
    product,
    productLoading,
    productError,
    reviews,
    reviewsLoading,
    reviewSubmitting,
    myReview,
    submitReview,
    removeMyReview,
  } = useProductDetailsController(productId);

  const { wishlistIds, wishlistBusyIds, toggleWishlist } =
    useWishlistController();
  const { cartBusyIds, cartAddedIds, addToCart } = useCartController();

  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const openReviewForm = () => {
    if (myReview) {
      setFormRating(myReview.rating);
      setFormComment(myReview.comment || "");
    } else {
      setFormRating(0);
      setFormComment("");
    }
    setShowReviewForm(true);
  };

  if (productLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading product...
        </p>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-3">
        <p className="text-xs font-semibold text-slate-500">
          {productError || "Product not found."}
        </p>
        <Link to="/shop">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-bold rounded-lg"
          >
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistIds.has(product._id);
  const isWishlistBusy = wishlistBusyIds.has(product._id);
  const isCartBusy = cartBusyIds.has(product._id);
  const justAdded = cartAddedIds.has(product._id);
  const outOfStock = product.stockCount <= 0;
  const image =
    product.images &&
    (Array.isArray(product.images) ? product.images[0] : product.images);
  // categoryId may or may not be populated depending on backend fix status
  const categoryName =
    typeof product.categoryId === "object" ? product.categoryId?.name : null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (formRating < 1) {
      alert("Please select a star rating.");
      return;
    }
    const success = await submitReview(formRating, formComment.trim());
    if (success) setShowReviewForm(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 antialiased">
      <Link to="/shop">
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-slate-200 text-xs gap-1.5 font-bold shadow-none rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Button>
      </Link>

      {/* PRODUCT HERO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl h-96 overflow-hidden flex items-center justify-center relative">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
              <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                No Image Provided
              </span>
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded shadow uppercase tracking-wide">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {categoryName && (
            <Badge className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-600 border-0 rounded-md">
              {categoryName}
            </Badge>
          )}
          <h1 className="text-2xl font-black text-slate-900 capitalize">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <StarRating value={product.averageRating || 0} />
            <span className="text-xs font-bold text-slate-500">
              {(product.averageRating || 0).toFixed(1)} ·{" "}
              {product.reviewCount || 0} review
              {product.reviewCount === 1 ? "" : "s"}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-indigo-600">
              ${product.price}
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] bg-slate-100 text-slate-500 border-0 font-bold uppercase"
            >
              {product.stockCount > 0
                ? `${product.stockCount} in stock`
                : "Sold out"}
            </Badge>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="lg"
              onClick={() => addToCart(product._id)}
              disabled={outOfStock || isCartBusy}
              className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 disabled:opacity-60"
            >
              {isCartBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : justAdded ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => toggleWishlist(product._id)}
              disabled={isWishlistBusy}
              className="h-11 w-11 p-0 border-slate-200"
              aria-label="Toggle wishlist"
            >
              {isWishlistBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-slate-500"
                  }`}
                />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Customer Reviews
            </h2>
            {!showReviewForm && (
              <Button
                size="sm"
                variant="outline"
                onClick={openReviewForm}
                className="h-8 text-xs font-bold rounded-lg border-slate-200"
              >
                {myReview ? "Edit My Review" : "Write a Review"}
              </Button>
            )}
          </div>

          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">
                  Your Rating
                </label>
                <StarPicker value={formRating} onChange={setFormRating} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">
                  Your Review
                </label>
                <Textarea
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="text-xs min-h-24 bg-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={reviewSubmitting}
                  className="h-8 text-xs font-bold bg-slate-900 hover:bg-slate-800 rounded-lg gap-1.5"
                >
                  {reviewSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : myReview ? (
                    "Update Review"
                  ) : (
                    "Post Review"
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowReviewForm(false)}
                  className="h-8 text-xs font-bold rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {reviewsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-xs font-semibold text-slate-400 text-center py-8">
              No reviews yet. Be the first to share your thoughts.
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => {
                const reviewerName =
                  review.userId?.fullname ||
                  review.userId?.username ||
                  "Anonymous";
                const isMine = myReview?._id === review._id;

                return (
                  <div
                    key={review._id}
                    className="border border-slate-100 rounded-xl p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 capitalize">
                            {reviewerName}
                          </span>
                          {review.isVerifiedPurchase && (
                            <Badge className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1 rounded-md font-bold">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                              Purchase
                            </Badge>
                          )}
                        </div>
                        <StarRating value={review.rating} size="w-3.5 h-3.5" />
                      </div>

                      {isMine && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={reviewSubmitting}
                          onClick={removeMyReview}
                          className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50/50"
                          aria-label="Delete my review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
