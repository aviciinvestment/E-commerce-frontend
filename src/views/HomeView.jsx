import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import { useHomeController } from "../controllers/useHomeController";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Flame,
  Percent,
  Mail,
  LayoutGrid,
  Layers3,
} from "lucide-react";

export const HomeView = () => {
  const { homeData, loading, handleNewsletterSubscribe, newsLoading } =
    useHomeController();
  const [newsEmail, setNewsEmail] = useState("");
  const navigate = useNavigate();
  const [flashSaleEndTime] = useState(() => Date.now() + 1000 * 60 * 60 * 4);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Loading Marketplace Experience...
        </p>
      </div>
    );
  }

  const { categories, featured, newArrivals, bestSellers, flashSale } =
    homeData;

  const onNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsEmail) return;
    const success = await handleNewsletterSubscribe(newsEmail);
    if (success) setNewsEmail("");
  };

  return (
    <div className="w-full space-y-16 pb-12 antialiased">
      {/* HOMEPAGE HERO SECTION */}
      <section className="relative rounded-2xl overflow-hidden bg-slate-900 text-white min-h-105 flex items-center px-6 md:px-12 shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10" />
        <div className="max-w-xl space-y-6">
          <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 gap-1.5 px-3 py-1 font-medium rounded-full shadow-none text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Season Release Active
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Elevate Your Everyday Essentials
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Explore curated collections tailored to perfection. Experience
            ultra-fast fulfillment tracking and independent certified
            multi-vendor marketplace catalog pricing.
          </p>
          <Button
            onClick={() => navigate("/shop")}
            className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-5 rounded-xl gap-2 transition-transform transform hover:scale-[1.01]"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* PROMOTIONAL BANNERS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-linear-to-r` from-amber-500 to-orange-600 rounded-xl p-6 text-white flex flex-col justify-between min-h-40 shadow-sm">
          <div className="space-y-1">
            <Badge className="bg-white/20 text-white border-0 text-[10px] font-bold uppercase rounded-md shadow-none tracking-wider">
              Flash Incentive
            </Badge>
            <h3 className="text-xl font-bold tracking-tight">
              Weekend Clearance Event
            </h3>
            <p className="text-xs text-white/80 font-medium">
              Take an extra 15% off standard cart allocations using crypto
              payouts processing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="text-xs font-bold underline flex items-center gap-1 self-start mt-4 bg-transparent border-0 text-white cursor-pointer"
          >
            Shop Deals ➔
          </button>
        </div>
        <div className="bg-linear-to-r from-indigo-600 to-violet-700 rounded-xl p-6 text-white flex flex-col justify-between min-h-40 shadow-sm">
          <div className="space-y-1">
            <Badge className="bg-white/20 text-white border-0 text-[10px] font-bold uppercase rounded-md shadow-none tracking-wider">
              Premium Logistics
            </Badge>
            <h3 className="text-xl font-bold tracking-tight">
              Free Continental Delivery
            </h3>
            <p className="text-xs text-white/80 font-medium">
              Automatically applied at checkout on shopping bags scaling past
              limits.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="text-xs font-bold underline flex items-center gap-1 self-start mt-4 bg-transparent border-0 text-white cursor-pointer"
          >
            Learn More ➔
          </button>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <LayoutGrid className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Browse Categories
          </h2>
        </div>
        {categories.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium">
            No system categories deployed yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Card
                key={cat._id}
                onClick={() => navigate(`/shop?category=${cat._id}`)}
                className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 min-h-25">
                  <Layers3 className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-800 tracking-tight capitalize truncate max-w-full">
                    {cat.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* FLASH SALE LIVE COUNTDOWN SECTION */}
      <section className="bg-red-50/60 border border-red-100 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="space-y-3">
          <Badge className="bg-red-100 text-red-700 border-red-200 font-bold tracking-wider text-[10px] uppercase gap-1 rounded-md shadow-none">
            <Flame className="w-3.5 h-3.5 fill-red-700 animate-pulse" />
            Limited Offer
          </Badge>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Flash Markdown Window
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            High demand stock lines markdown allocations expire instantly when
            counter drops to absolute zero.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Expires In:
            </span>
            {/* ⚡ THE COMPLETE FIXED COUNTDOWN DOM ELEMENT BLOCK ⚡ */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Expires In:
              </span>
              <div className="font-mono text-base font-bold text-red-600 bg-white border border-red-200 px-3 py-1 rounded-md shadow-sm">
                {/* ✅ Good: Swapped out Date.now() for our stable flashSaleEndTime state variable */}
                <Countdown date={flashSaleEndTime} />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {flashSale.length === 0 ? (
            <div className="sm:col-span-2 text-center py-6 text-xs text-slate-400 font-medium">
              Clearance lines tracking empty currently.
            </div>
          ) : (
            flashSale.map((prod) => (
              <Card
                key={prod._id}
                className="bg-white border-red-100 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-red-600 text-white rounded font-bold text-[10px]">
                      <Percent className="w-3 h-3 mr-0.5" /> Markdown
                    </Badge>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      SKU: {prod.sku?.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {prod.name}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-red-600">
                      ${prod.price}
                    </span>
                    <span className="text-xs font-medium text-slate-400 line-through">
                      ${(prod.price * 1.25).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <div className="p-2 bg-red-50/40 border-t border-red-50">
                  <Button
                    onClick={() => navigate("/shop")}
                    className="w-full h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
                  >
                    Claim Markdown Allocation
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
      {/* FEATURED PRODUCTS SHOWCASES */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-2">
          Featured Showcases
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((prod) => (
            <Card
              key={prod._id}
              className="bg-white border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden"
            >
              <CardContent className="p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 truncate">
                  {prod.name}
                </h4>
                <p className="text-xs font-black text-indigo-600">
                  ${prod.price ? prod.price.toFixed(2) : "0.00"}
                </p>
              </CardContent>
              <div className="p-2 bg-slate-50">
                <Button
                  onClick={() => navigate("/shop")}
                  variant="outline"
                  className="w-full h-8 text-xs border-slate-200 text-slate-700 hover:bg-white"
                >
                  Inspect Asset
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS & BEST SELLERS SPLITS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Fresh Arrivals Log Column */}
        <div className="space-y-4">
          <h3 className="text-base font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-2">
            Fresh Arrivals
          </h3>
          <div className="space-y-3">
            {newArrivals.map((prod) => (
              <div
                key={prod._id}
                className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="min-w-0 max-w-[70%]">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    SKU code: {prod.sku || "N/A"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900">
                    ${prod.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers Analytics Column */}
        <div className="space-y-4">
          <h3 className="text-base font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-2">
            Highest Trailing / Best Sellers
          </h3>
          <div className="space-y-3">
            {bestSellers.map((prod) => (
              <div
                key={prod._id}
                className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="min-w-0 max-w-[70%]">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] font-medium text-emerald-600 mt-0.5">
                    ⭐ {prod.averageRating || "4.5"} ({prod.reviewCount || "0"}{" "}
                    reviews)
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900">
                    ${prod.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SUBSCRIPTION CAMPAIGN PANEL */}
      <section className="bg-indigo-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg border border-indigo-950 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,var(--tw-gradient-stops))] from-indigo-800 via-indigo-900 to-slate-900 -z-10" />
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            Stay updated with promotions
          </h3>
          <p className="text-xs text-indigo-200 leading-relaxed font-medium">
            Sign up to our aggregate newsletter tracking dispatch to receive
            exclusive coupon keys and markdown allocations alerts.
          </p>
        </div>
        <form
          onSubmit={onNewsletterSubmit}
          className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto md:max-w-md"
        >
          <Input
            type="email"
            placeholder="Enter your email address"
            className="bg-white/10 border-indigo-700/50 text-white placeholder:text-indigo-300 h-10 px-4 rounded-xl focus-visible:ring-indigo-400 focus-visible:bg-white/20 transition-all sm:min-w-65"
            value={newsEmail}
            onChange={(e) => setNewsEmail(e.target.value)}
            disabled={newsLoading}
            required
          />
          <Button
            type="submit"
            className="bg-white hover:bg-slate-100 text-indigo-900 font-bold h-10 px-5 rounded-xl transition-colors shadow-sm"
            disabled={newsLoading}
          >
            {newsLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </section>
    </div>
  );
};
