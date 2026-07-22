import { Link } from "react-router-dom";
import { useWishlistPageController } from "../controllers/useWishlistPageController";
import { useCartController } from "../controllers/useCartController";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Loader2,
  Check,
  ArrowLeft,
} from "lucide-react";

export const WishlistView = () => {
  const { products, loading, busyIds, removeItem } =
    useWishlistPageController();
  const { cartBusyIds, cartAddedIds, addToCart } = useCartController();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading your wishlist...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 antialiased">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            Your Wishlist
          </h1>
        </div>
        <Link to="/shop">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-200 text-xs gap-1.5 font-bold shadow-none rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="border border-dashed border-slate-200 bg-white rounded-2xl p-16 text-center space-y-3">
          <Heart className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold text-slate-400">
            Nothing saved yet. Tap the heart on any product to add it here.
          </p>
          <Link to="/shop">
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-xs font-bold h-8 px-4 rounded-lg"
            >
              Browse Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((prod) => {
            const isRemoving = busyIds.has(prod._id);
            const isCartBusy = cartBusyIds.has(prod._id);
            const justAdded = cartAddedIds.has(prod._id);
            const outOfStock = prod.stockCount <= 0;
            const image =
              prod.images &&
              (Array.isArray(prod.images) ? prod.images[0] : prod.images);

            return (
              <Card
                key={prod._id}
                className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="bg-slate-50 border border-slate-100/50 rounded-lg h-44 overflow-hidden flex items-center justify-center relative">
                    {image ? (
                      <img
                        src={image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-300 gap-1">
                        <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          No Image Provided
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeItem(prod._id)}
                      disabled={isRemoving}
                      aria-label="Remove from wishlist"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-60"
                    >
                      {isRemoving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      )}
                    </button>

                    {outOfStock && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow uppercase tracking-wide">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate capitalize">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-sm font-black text-indigo-600">
                      ${prod.price}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[9px] bg-slate-100 text-slate-500 rounded border-0 px-1.5 font-bold uppercase"
                    >
                      {prod.stockCount > 0
                        ? `${prod.stockCount} Available`
                        : "Sold Out"}
                    </Badge>
                  </div>
                </CardContent>

                <div className="p-2 bg-slate-50/50 border-t border-slate-100">
                  <Button
                    size="sm"
                    onClick={() => addToCart(prod._id)}
                    disabled={outOfStock || isCartBusy}
                    className="w-full h-8 text-xs bg-slate-900 text-white hover:bg-slate-800 font-medium transition-colors gap-1.5 disabled:opacity-60"
                  >
                    {isCartBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : justAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
