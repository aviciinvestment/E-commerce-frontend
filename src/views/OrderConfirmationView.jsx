import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { confirmPaymentAndPlaceOrderAPI } from "../services/orderService";
import { getUserId } from "../utils/getUserId";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export const OrderConfirmationView = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const userId = getUserId();
      // Paystack appends ?reference=... (and often &trxref=...) to the callback URL
      const paymentReference =
        searchParams.get("reference") || searchParams.get("trxref");
      // Fallback to whatever we stashed before redirecting to Paystack
      const orderId =
        paymentReference || localStorage.getItem("pendingOrderId");

      if (!userId || !orderId || !paymentReference) {
        if (!cancelled) {
          setStatus("error");
          setMessage(
            "Missing payment details. If you completed payment, check your order history instead.",
          );
        }
        return;
      }

      try {
        const json = await confirmPaymentAndPlaceOrderAPI(
          userId,
          orderId,
          paymentReference,
        );

        if (!cancelled) {
          if (json.success) {
            setStatus("success");
            setOrder(json.data);
            localStorage.removeItem("pendingOrderId");
          } else {
            setStatus("error");
            setMessage(json.message || "We couldn't confirm your payment.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setMessage(
            err.response?.data?.error ||
              err.response?.data?.message ||
              "We couldn't confirm your payment. Please check your order history.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="p-8 text-center space-y-4">
          {status === "verifying" && (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-slate-900 mx-auto" />
              <h2 className="text-base font-black text-slate-900">
                Confirming your payment...
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Please don't close this page.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h2 className="text-lg font-black text-slate-900">
                Order Placed Successfully!
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {order?._id
                  ? `Your order (#${order._id.slice(-8).toUpperCase()}) is confirmed.`
                  : "Your order is confirmed."}
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/orders">
                  <Button className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-xs font-bold rounded-xl gap-1.5">
                    View My Orders <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button
                    variant="outline"
                    className="w-full h-10 text-xs font-bold rounded-xl border-slate-200"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h2 className="text-base font-black text-slate-900">
                Payment Confirmation Issue
              </h2>
              <p className="text-xs text-slate-500 font-medium">{message}</p>
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/shop">
                  <Button
                    variant="outline"
                    className="w-full h-10 text-xs font-bold rounded-xl border-slate-200 gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Back to Shop
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
