import { useState, useEffect, useRef } from "react";
import {
  fetchHomepagePayloadAPI,
  subscribeNewsletterAPI,
} from "../services/homeService";
import { toast } from "sonner";

export const useHomeController = () => {
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [homeData, setHomeData] = useState({
    categories: [],
    featured: [],
    newArrivals: [],
    bestSellers: [],
    flashSale: [],
  });

  const hasExecutedRef = useRef(false);

  const pullHomepageContent = async () => {
    try {
      const payload = await fetchHomepagePayloadAPI();
      setHomeData(payload);
    } catch (err) {
      console.error("Discovery matrix load failure:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      pullHomepageContent();
    }
  }, []);

  const handleNewsletterSubscribe = async (email) => {
    setNewsLoading(true);
    try {
      const res = await subscribeNewsletterAPI(email);
      toast.success(
        res.message || "Subscribed successfully to newsletter logs!",
      );
      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Subscription processing failed.",
      );
      return false;
    } finally {
      setNewsLoading(false);
    }
  };

  return { homeData, loading, handleNewsletterSubscribe, newsLoading };
};
