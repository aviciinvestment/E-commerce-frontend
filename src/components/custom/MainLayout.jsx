import { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ShoppingBag, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MainLayout = () => {
  const { pathname } = useLocation();

  // 2. Automated Scroll To Top integration on routing state updates
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* GLOBAL NAVBAR COMPONENT CONTAINER */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight"
        >
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <span>E-Store</span>
        </Link>

        {/* Navigation Center Paths Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="hover:text-indigo-600 transition-colors">
            Catalog
          </Link>
        </div>

        {/* Navigation Right Action Panel Buttons */}
        <div className="flex items-center gap-2">
          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-indigo-600 relative h-9 w-9"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
            </Button>
          </Link>

          <Link to="/login">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-indigo-600 h-9 w-9"
            >
              <User className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-600 h-9 w-9"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* 2. THE DYNAMIC RESPONSIVE MAIN BODY CONTAINER */}
      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
        <Outlet /> {/* Injects your individual sub-views dynamically here */}
      </main>

      {/* GLOBAL FOOTER COMPONENT CONTAINER */}
      <footer className="w-full bg-white border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-6 text-center text-xs font-medium text-slate-400">
        <div>
          &copy; {new Date().getFullYear()} E-Commerce Platform Marketplace
          Engine. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
