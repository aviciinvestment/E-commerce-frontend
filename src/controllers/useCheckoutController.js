import { useState, useEffect, useCallback } from "react";
import { createCheckoutSessionAPI } from "../services/checkoutService";
import { getUserAddressesAPI } from "../services/addressService";
import { startPaymentAPI } from "../services/paymentService";
import { getUserId } from "../utils/getUserId";

export const useCheckoutController = () => {
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(() => !!getUserId());
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [summary, setSummary] = useState(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    let cancelled = false;

    (async () => {
      setAddressesLoading(true);
      try {
        const json = await getUserAddressesAPI(userId);
        const list = json.data || [];
        if (!cancelled) {
          setAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr._id);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      } finally {
        if (!cancelled) setAddressesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const createCheckoutSession = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setError("Please log in to continue checkout.");
      return null;
    }
    if (!selectedAddressId) {
      setError("Please select a shipping address.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const json = await createCheckoutSessionAPI(
        userId,
        selectedAddressId,
        couponCode.trim() || null,
      );

      if (!json.success) {
        throw new Error(json.message || "Checkout failed. Please try again.");
      }

      setSummary(json.summary);
      setCheckoutSessionId(json.checkoutSessionId);
      return json;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Checkout failed. Please try again.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedAddressId, couponCode]);

  // Initializes payment with Paystack and redirects the user to complete it
  const placeOrder = useCallback(async () => {
    const userId = getUserId();
    if (!userId || !checkoutSessionId) {
      setError(
        "Please generate an order summary before proceeding to payment.",
      );
      return;
    }

    setPlacingOrder(true);
    setError(null);

    try {
      const json = await startPaymentAPI(checkoutSessionId, "paystack");
      if (!json.success || !json.paymentUrl) {
        throw new Error("Could not start payment. Please try again.");
      }

      // Stash the order id so the return page can confirm payment,
      // as a fallback in case Paystack's own reference param doesn't map to it directly
      localStorage.setItem("pendingOrderId", checkoutSessionId);

      window.location.href = json.paymentUrl;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Could not start payment. Please try again.";
      setError(message);
      setPlacingOrder(false);
    }
  }, [checkoutSessionId]);

  return {
    addresses,
    addressesLoading,
    selectedAddressId,
    setSelectedAddressId,
    couponCode,
    setCouponCode,
    summary,
    checkoutSessionId,
    loading,
    placingOrder,
    error,
    createCheckoutSession,
    placeOrder,
  };
};
