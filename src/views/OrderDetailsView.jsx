import { useParams, Link } from "react-router-dom";
import { useOrderDetailsController } from "../controllers/useOrderDetailsController";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  MapPin,
  Loader2,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

const RETURNABLE_STATUSES = ["Delivered"];

export const OrderDetailsView = () => {
  const { orderId } = useParams();
  const { order, loading, error, actionLoading, requestReturn } =
    useOrderDetailsController(orderId);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-3">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="text-xs font-semibold text-slate-500">
          {error || "Order not found."}
        </p>
        <Link to="/orders">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-bold rounded-lg"
          >
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const canRequestReturn = RETURNABLE_STATUSES.includes(order.status);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 antialiased">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
        </div>
        <Link to="/orders">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-200 text-xs gap-1.5 font-bold shadow-none rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Orders
          </Button>
        </Link>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <Badge className="text-[9px] font-bold uppercase px-2 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">
              {order.status}
            </Badge>
            <p className="text-[10px] text-slate-400 font-medium">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {canRequestReturn && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={actionLoading}
              onClick={requestReturn}
              className="h-8 text-xs font-bold gap-1.5 border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              {actionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              Request Return
            </Button>
          )}
        </CardContent>
      </Card>

      {/* SHIPPING ADDRESS */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900">
              Shipping Address
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium capitalize">
            {order.shippingAddress?.street}
          </p>
          <p className="text-xs text-slate-500">
            {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
            {order.shippingAddress?.zipCode}
          </p>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
            {order.shippingAddress?.country}
          </p>
        </CardContent>
      </Card>

      {/* ITEMS */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-sm font-black text-slate-900">Items</h3>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div
                key={item.productId || i}
                className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0"
              >
                <span className="text-slate-700 font-medium">
                  {item.name}{" "}
                  <span className="text-slate-400">× {item.quantity}</span>
                </span>
                <span className="font-bold text-slate-900">
                  ${item.lineTotal?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PRICE BREAKDOWN */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="font-bold text-slate-900">
              ${order.subtotal?.toFixed(2)}
            </span>
          </div>
          {order.discountApplied > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-medium">Discount</span>
              <span className="font-bold text-emerald-600">
                -${order.discountApplied.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Shipping</span>
            <span className="font-bold text-slate-900">
              {order.shippingCost === 0
                ? "Free"
                : `$${order.shippingCost?.toFixed(2)}`}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Tax</span>
            <span className="font-bold text-slate-900">
              ${order.taxCost?.toFixed(2)}
            </span>
          </div>
          <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
            <span className="text-sm font-black text-slate-900">Total</span>
            <span className="text-lg font-black text-indigo-600">
              ${order.grandTotal?.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
