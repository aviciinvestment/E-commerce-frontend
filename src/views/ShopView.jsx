import { useState } from "react";
import { useCatalogController } from "../controllers/useCatalogController";
import { useWishlistController } from "../controllers/useWishlistController";
import { useCartController } from "../controllers/useCartController";
import { ProductSkeleton } from "../components/custom/ProductSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  DollarSign,
  Loader2,
  Check,
} from "lucide-react";

export const ShopView = () => {
  const {
    products,
    loading,
    pagination,
    searchFilter,
    sortFilter,
    minPriceFilter,
    maxPriceFilter,
    updateFilters,
    handlePageChange,
  } = useCatalogController();

  const { wishlistIds, wishlistBusyIds, toggleWishlist } =
    useWishlistController();
  const { cartBusyIds, cartAddedIds, addToCart } = useCartController();

  // Local state parameters to buffer fast keystroke input streams
  const [localSearch, setLocalSearch] = useState(searchFilter);
  const [localMin, setLocalMin] = useState(minPriceFilter);
  const [localMax, setLocalMax] = useState(maxPriceFilter);

  const applySearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: localSearch });
  };

  const applyPriceBracketsSubmit = (e) => {
    e.preventDefault();
    updateFilters({ minPrice: localMin, maxPrice: localMax });
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 antialiased items-start">
      {/* ─────────────────────────────────────────────────────────
          LEFT COLUMN SIDEBAR: SEARCH & PRICE SLIDERS FORMS
          ───────────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-white border border-slate-200 rounded-xl p-5 shrink-0 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-sm text-slate-800">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Refine Product Discovery</span>
        </div>

        <form onSubmit={applySearchSubmit} className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Search Keyword
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="e.g. Arduino..."
              className="pl-9 text-xs h-9 focus-visible:ring-indigo-500"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </form>

        <form onSubmit={applyPriceBracketsSubmit} className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Price Thresholds ($)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="number"
                placeholder="Min"
                className="pl-6 text-xs h-8"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
              />
            </div>
            <span className="text-slate-300 text-sm font-bold">-</span>
            <div className="relative flex-1">
              <DollarSign className="absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="number"
                placeholder="Max"
                className="pl-6 text-xs h-8"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs h-8 font-semibold"
          >
            Apply Price Caps
          </Button>
        </form>
      </aside>

      {/* ─────────────────────────────────────────────────────────
          RIGHT COLUMN MAIN FEED: SORT BAR AND PRODUCT GRID MATRIX
          ───────────────────────────────────────────────────────── */}
      <section className="flex-1 w-full space-y-6">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {products.length} matching inventory records found
          </span>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortFilter}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 focus-visible:outline-none"
            >
              <option value="-createdAt">Newest Products</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <ProductSkeleton />
        ) : products.length === 0 ? (
          <div className="border border-dashed border-slate-200 bg-white rounded-xl p-16 text-center text-slate-400 text-xs font-medium">
            Zero database assets matched those specific parameters. Try shifting
            slider limits.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => {
              const isWishlisted = wishlistIds.has(prod._id);
              const isWishlistBusy = wishlistBusyIds.has(prod._id);
              const isCartBusy = cartBusyIds.has(prod._id);
              const justAdded = cartAddedIds.has(prod._id);
              const outOfStock = prod.stockCount <= 0;

              return (
                <Card
                  key={prod._id}
                  className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="bg-slate-50 border border-slate-100/50 rounded-lg h-44 overflow-hidden flex items-center justify-center relative">
                      {prod.images && prod.images.length > 0 ? (
                        <img
                          src={
                            Array.isArray(prod.images)
                              ? prod.images[0]
                              : prod.images
                          }
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
                        onClick={() => toggleWishlist(prod._id)}
                        disabled={isWishlistBusy}
                        aria-label={
                          isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-60"
                      >
                        {isWishlistBusy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                        ) : (
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              isWishlisted
                                ? "fill-red-500 text-red-500"
                                : "text-slate-400"
                            }`}
                          />
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
                      <p className="text-[10px] font-mono text-slate-400 font-bold uppercase truncate">
                        SKU: {prod.sku?.slice(-6)}
                      </p>
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

                  <div className="p-2 bg-slate-50/50 border-t border-slate-100 flex gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => addToCart(prod._id)}
                      disabled={outOfStock || isCartBusy}
                      className="flex-1 h-8 text-xs bg-slate-900 text-white hover:bg-slate-800 font-medium transition-colors gap-1.5 disabled:opacity-60"
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

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-bold text-slate-500 tracking-wide px-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
