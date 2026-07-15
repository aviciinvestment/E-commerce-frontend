import { useNavigate } from "react-router-dom";
import { useProductDetailController } from "../controllers/useProductDetailController";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";

export const ProductDetailView = () => {
  const {
    product,
    relatedProducts,
    loading,
    activeImgIndex,
    setActiveImgIndex,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    quantity,
    adjustQuantity,
  } = useProductDetailController();

  const navigate = useNavigate();
  const recentHistory =
    JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Parsing Product Ledger...
        </p>
      </div>
    );
  }

  if (!product)
    return (
      <div className="text-center py-12 text-slate-400 text-sm font-semibold">
        Target inventory product missing or deleted.
      </div>
    );

  const imgArray = Array.isArray(product.images)
    ? product.images
    : [product.images].filter(Boolean);

  return (
    <div className="w-full space-y-16 pb-12 antialiased">
      {/* COLUMN CONTENT LAYOUT WRROLLER */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* LEFT COMPONENT: GALLERY STACK */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl h-[400px] overflow-hidden flex items-center justify-center relative group">
            {imgArray.length > 0 ? (
              <img
                src={imgArray[activeImgIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <ShoppingBag className="w-12 h-12 text-slate-200" />
            )}
          </div>

          {imgArray.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {imgArray.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImgIndex(index)}
                  className={`w-20 h-20 bg-white border rounded-xl overflow-hidden shrink-0 transition-all ${
                    activeImgIndex === index
                      ? "border-indigo-600 ring-2 ring-indigo-100"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COMPONENT: METADATA SELECTION CARD */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 capitalize">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-indigo-600">
                ${product.price.toFixed(2)}
              </span>
              <Badge
                variant="outline"
                className={`font-bold px-2 py-0.5 rounded shadow-none text-[10px] uppercase ${
                  product.stockCount > 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {product.stockCount > 0
                  ? `${product.stockCount} Units Available`
                  : "Sold Out"}
              </Badge>
            </div>
          </div>

          <Separator className="bg-slate-200/60" />

          {/* DYNAMIC VARIANT MANAGEMENT */}
          {product.variants && (
            <div className="space-y-4">
              {product.variants.colors?.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                    Select Color Option
                  </label>
                  <div className="flex items-center gap-2">
                    {product.variants.colors.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`text-xs font-semibold px-3 py-1.5 border rounded-lg capitalize transition-all ${
                          selectedColor === col
                            ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.variants.sizes?.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                    Select Size Scale
                  </label>
                  <div className="flex items-center gap-2">
                    {product.variants.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 text-xs font-bold border rounded-lg flex items-center justify-center transition-all ${
                          selectedSize === sz
                            ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QUANTITY TRACKER MODULE */}
          {product.stockCount > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                Allocation Quantity
              </label>
              <div className="flex items-center gap-3 bg-white border border-slate-200 w-32 rounded-xl p-1 justify-between shadow-none">
                <Button
                  type="button"
                  onClick={() => adjustQuantity(-1, product.stockCount)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-slate-500"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {quantity}
                </span>
                <Button
                  type="button"
                  onClick={() => adjustQuantity(1, product.stockCount)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-slate-500"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* CHECKOUT CALL TO ACTION TRIGGERS */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              disabled={product.stockCount <= 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl shadow gap-2 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Add Cargo Allocation to Cart
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 border-slate-200 text-slate-400 hover:text-red-500 rounded-xl shrink-0"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[11px] font-semibold text-slate-500 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-indigo-500" />
              <span>Secure Express Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-indigo-500" />
              <span>30-Day Escrow Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Certified Genuine Item</span>
            </div>
          </div>
        </div>
      </section>
      {/* TECHNICAL DESCRIPTION ELEMENT SECTION */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
          Technical Description & Context
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
          {product.description ||
            "No descriptive parameter string added to this document item catalog."}
        </p>
      </section>

      {/* RELATED DISCOVERIES CORRELATION CAROUSEL */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-base font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-2">
            Related Discoveries
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Card
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer overflow-hidden transition-all flex flex-col justify-between"
              >
                <CardContent className="p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 truncate capitalize">
                    {p.name}
                  </h4>
                  <p className="text-xs font-black text-indigo-600">
                    ${p.price.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* HISTORICAL RECENT BROWSING TRAILS */}
      {recentHistory.length > 1 && (
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recently Browsed Asset Lines
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentHistory
              .filter((p) => p._id !== product._id)
              .map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-colors min-w-[200px] max-w-[240px]"
                >
                  <div className="w-10 h-10 bg-slate-50 border rounded-lg shrink-0 overflow-hidden flex items-center justify-center text-slate-300">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate capitalize">
                      {p.name}
                    </h4>
                    <p className="text-[11px] font-black text-indigo-600 mt-0.5">
                      ${p.price}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};
