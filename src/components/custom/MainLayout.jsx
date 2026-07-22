import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ShoppingBag, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// 1. Import your brand new Search Component
import { GlobalSearchBar } from "./GlobalSearchBar";

export const MainLayout = () => {
  const { pathname } = useLocation();
  // 3. State to control the mobile nav dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Automated Scroll To Top integration on routing state updates
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Catalog" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/wishlist", label: "wishlist" },
  ];

  // Helper so every mobile link closes the dropdown when clicked
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
          {/* ⚡ THE INTEGRATION: Placed cleanly in the middle of your global header wrapper */}
        </Link>
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <GlobalSearchBar />
        </div>
        {/* Navigation Center Paths Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Navigation Right Action Panel Buttons */}
        <div className="flex items-center gap-2">
          <Link to="/cart" onClick={closeMobileMenu}>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-indigo-600 relative h-9 w-9"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
            </Button>
          </Link>

          <Link to="/login" onClick={closeMobileMenu}>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-indigo-600 h-9 w-9"
            >
              <User className="w-4 h-4" />
            </Button>
          </Link>

          {/* 4. Toggle button now flips between Menu and X icons */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-slate-600 h-9 w-9"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>
      </nav>

      {/* 5. MOBILE DROPDOWN PANEL — only rendered on small screens when open */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-white border-b border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 sm:px-6 py-4 flex flex-col gap-1">
            {/* Search bar inside the mobile dropdown too */}
            <div className="mb-3">
              <GlobalSearchBar />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className="px-3 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

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
