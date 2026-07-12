import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  LayoutDashboard,
  PackageCheck,
  Heart,
  MapPin,
  LogOut,
} from "lucide-react";

export const DashboardLayout = ({
  children,
  activeTab,
  onTabChange,
  onLogout,
  profileName,
}) => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row text-slate-900 antialiased font-sans">
      {/* 1. THE LEFT SIDEBAR MENU PANEL */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col px-4 py-6 justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand Logo Identity Header */}
          <div className="px-2 flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <span>StoreFront UI</span>
          </div>

          {/* Nav Navigation List Blocks */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => onTabChange("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === "overview"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Overview
            </button>

            <button
              type="button"
              onClick={() => onTabChange("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === "orders"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              My Purchases
            </button>

            <button
              type="button"
              onClick={() => onTabChange("wishlist")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === "wishlist"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Heart className="w-4 h-4" />
              My Wishlist
            </button>

            <button
              type="button"
              onClick={() => onTabChange("addresses")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === "addresses"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <MapPin className="w-4 h-4" />
              Address Profiles
            </button>
          </nav>
        </div>

        {/* Account Session Termination Action Trigger Button */}
        <Button
          type="button"
          onClick={onLogout}
          variant="outline"
          className="w-full border-slate-200 text-slate-600 hover:text-red-600 justify-start gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout Account
        </Button>
      </aside>

      {/* 2. THE MAIN DISPLAY WINDOW WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP STATUS BAR TOP NAV HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Account Active Context
            </span>
            <span className="text-sm font-bold text-slate-800 capitalize">
              {activeTab} View
            </span>
          </div>

          <div className="flex items-center gap-2 border border-slate-100 bg-slate-50 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-600">
              {profileName || "Customer"}
            </span>
          </div>
        </header>

        {/* CORE CONTAINER SCROLL ELEMENT LAYER */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
