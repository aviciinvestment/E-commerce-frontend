import { Link } from "react-router-dom";

import { useCartPageController } from "../controllers/useCartPageController";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export const CartView = () => {
  const { cart, loading, busyIds, changeQuantity, removeItem } =
    useCartPageController();

  const items = cart.items || [];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading your cart...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 antialiased">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            Your Cart
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

      {items.length === 0 ? (
        <div className="border border-dashed border-slate-200 bg-white rounded-2xl p-16 text-center space-y-3">
          <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold text-slate-400">
            Your cart is empty. Go find something you like.
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
        <>
          <div className="space-y-3">
            {items.map((item) => {
              const product = item.productId;
              const isBusy = busyIds.has(product?._id);
              const image =
                product?.images &&
                (Array.isArray(product.images)
                  ? product.images[0]
                  : product.images);

              return (
                <Card
                  key={product?._id || item._id}
                  className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 shrink-0 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {image ? (
                        <img
                          src={image}
                          alt={product?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">
                        {product?.name || "Product"}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        ${item.pricePerItem?.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={isBusy || item.quantity <= 1}
                        onClick={() =>
                          changeQuantity(product?._id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-xs font-bold w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={isBusy}
                        onClick={() =>
                          changeQuantity(product?._id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="w-20 text-right shrink-0">
                      <span className="text-sm font-black text-slate-900">
                        ${item.lineTotal?.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isBusy}
                      onClick={() => removeItem(product?._id)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50/50 shrink-0"
                    >
                      {isBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600">
                Cart Total
              </span>
              <span className="text-xl font-black text-indigo-600">
                ${cart.cartTotal?.toFixed(2) || "0.00"}
              </span>
            </CardContent>
          </Card>

          <Link to="/checkout" className="block">
            <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl shadow-none">
              Proceed to Checkout
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};
