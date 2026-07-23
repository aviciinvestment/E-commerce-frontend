import { Link } from "react-router-dom";
import { useOrderHistoryController } from "../controllers/useOrderHistoryController";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Loader2,
  ArrowLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";

const STATUS_STYLES = {
  PendingPayment: "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Shipped: "bg-sky-50 text-sky-700 border-sky-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  ReturnRequested: "bg-orange-50 text-orange-700 border-orange-200",
};

const CANCELLABLE_STATUSES = ["PendingPayment", "Paid", "Processing"];

export const OrderHistoryView = () => {
  const { orders, loading, busyIds, cancelOrder } = useOrderHistoryController();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 antialiased">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            My Orders
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

      {orders.length === 0 ? (
        <div className="border border-dashed border-slate-200 bg-white rounded-2xl p-16 text-center space-y-3">
          <Package className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold text-slate-400">
            You haven't placed any orders yet.
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
        <div className="space-y-3">
          {orders.map((order) => {
            const isBusy = busyIds.has(order._id);
            const canCancel = CANCELLABLE_STATUSES.includes(order.status);
            const statusStyle =
              STATUS_STYLES[order.status] ||
              "bg-slate-100 text-slate-500 border-slate-200";

            return (
              <Card
                key={order._id}
                className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
              >
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <Link
                    to={`/orders/${order._id}`}
                    className="flex-1 min-w-0 flex items-center gap-4"
                  >
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <Badge
                          className={`text-[9px] font-bold uppercase px-1.5 rounded border ${statusStyle}`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {order.items?.length || 0} item
                        {order.items?.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-black text-slate-900">
                      ${order.grandTotal?.toFixed(2)}
                    </span>

                    {canCancel && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isBusy}
                        onClick={() => cancelOrder(order._id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50/50"
                        aria-label="Cancel order"
                      >
                        {isBusy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    )}

                    <Link to={`/orders/${order._id}`}>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
