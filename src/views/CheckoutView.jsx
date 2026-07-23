import { Link } from "react-router-dom";
import { useCheckoutController } from "../controllers/useCheckoutController";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Tag,
  Receipt,
  CreditCard,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";

export const CheckoutView = () => {
  const {
    addresses,
    addressesLoading,
    selectedAddressId,
    setSelectedAddressId,
    couponCode,
    setCouponCode,
    summary,
    loading,
    placingOrder,
    error,
    createCheckoutSession,
    placeOrder,
  } = useCheckoutController();

  const handleGetSummary = (e) => {
    e.preventDefault();
    createCheckoutSession();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 antialiased">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            Checkout
          </h1>
        </div>
        <Link to="/cart">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-200 text-xs gap-1.5 font-bold shadow-none rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200 rounded-xl">
          <CardContent className="p-3.5 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: Address + Coupon */}
        <div className="lg:col-span-2 space-y-6">
          {/* SHIPPING ADDRESS PICKER */}
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Shipping Address
                  </h3>
                </div>
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-bold text-indigo-600 gap-1 px-2"
                  >
                    <Plus className="w-3 h-3" /> Manage Addresses
                  </Button>
                </Link>
              </div>

              {addressesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-xs font-semibold text-slate-400 space-y-2">
                  <p>You don't have any saved addresses yet.</p>
                  <Link to="/dashboard">
                    <Button
                      size="sm"
                      className="bg-slate-900 hover:bg-slate-800 text-xs font-bold h-8 px-4 rounded-lg"
                    >
                      Add an Address
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id;
                    return (
                      <button
                        type="button"
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`w-full text-left border rounded-xl p-3.5 flex items-start justify-between gap-3 transition-all ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex gap-3 items-start min-w-0">
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              isSelected
                                ? "bg-indigo-100 text-indigo-600"
                                : "bg-slate-50 text-slate-400"
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div className="space-y-0.5 text-xs text-slate-600 min-w-0">
                            <div className="font-bold text-sm text-slate-900 capitalize truncate">
                              {addr.street}
                            </div>
                            <div>
                              {addr.city}, {addr.state} {addr.zipCode}
                            </div>
                            <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                              {addr.country}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                        {addr.isDefault && !isSelected && (
                          <Badge className="text-[9px] bg-slate-100 text-slate-500 border-0 shrink-0 font-bold uppercase">
                            Default
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* COUPON CODE */}
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Promo Code
                </h3>
              </div>
              <form onSubmit={handleGetSummary} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code (optional)"
                  className="h-10 text-xs shadow-none border-slate-200 focus-visible:ring-indigo-500 uppercase"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={loading || !selectedAddressId}
                  className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-xs font-bold rounded-lg shrink-0 gap-1.5"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Review Order"
                  )}
                </Button>
              </form>
              <p className="text-[10px] text-slate-400 font-medium">
                Leave blank if you don't have a promo code, then tap "Review
                Order" to see your total.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden lg:sticky lg:top-24">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Receipt className="w-4 h-4 text-indigo-600" /> Order Summary
            </h3>

            {!summary ? (
              <div className="text-center py-8 text-xs font-semibold text-slate-400">
                Select an address and tap "Review Order" to see your total.
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {summary.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-600 font-medium truncate max-w-[65%]">
                        {item.name}{" "}
                        <span className="text-slate-400">
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="font-bold text-slate-900 shrink-0">
                        ${item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="font-bold text-slate-900">
                      ${summary.subTotal.toFixed(2)}
                    </span>
                  </div>

                  {summary.discountApplied > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-medium">
                        Discount
                      </span>
                      <span className="font-bold text-emerald-600">
                        -${summary.discountApplied.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Shipping</span>
                    <span className="font-bold text-slate-900">
                      {summary.shippingCost === 0
                        ? "Free"
                        : `$${summary.shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Tax</span>
                    <span className="font-bold text-slate-900">
                      ${summary.taxCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">
                    Total
                  </span>
                  <span className="text-xl font-black text-indigo-600">
                    ${summary.grandTotal.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={placeOrder}
                  disabled={placingOrder}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl shadow-none gap-2"
                >
                  {placingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting to Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Place Order & Pay
                    </>
                  )}
                </Button>

                <p className="text-[10px] text-center text-slate-400 font-medium">
                  You'll be redirected to Paystack to complete payment securely.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
