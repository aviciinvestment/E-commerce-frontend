import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompleteDashboardAPI } from "../services/userService";
import { useWishlistController } from "../controllers/useWishlistController";
import { ProfileView } from "./ProfileView";
import {
  Card,
  CardContent,
  //CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  //MapPin,
  ShoppingCart,
  LogOut,
  User,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  PackageCheck,
  AlertCircle,
} from "lucide-react";

export const DashboardView = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState({
    profile: null,
    orders: [],
    cart: { items: [] },
    addresses: [],
    wishlist: [],
  });

  const navigate = useNavigate();
  const hasExecutedRef = useRef(false);

  // 1. Data Fetcher Engine: Gathers all system metrics concurrently
  const pullDashboardPayload = async () => {
    // Replace with dynamic JWT context user ID decoders in production
    const mockUserId = "60d5ec494a822211116b4321";
    try {
      const payload = await fetchCompleteDashboardAPI(mockUserId);
      setStoreData(payload);
    } catch (err) {
      console.error("Dashboard pull fail:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      pullDashboardPayload();
    }
  }, []);

  // Connect our structural wishlist controllers directly into the re-fetch loop
  const { handleToggleWishlist, handleMoveToCart } =
    useWishlistController(pullDashboardPayload);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-2">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Syncing Account Environment...
        </p>
      </div>
    );
  }

  const profile = storeData?.profile || null;
  const orders = storeData?.orders || [];
  const cart = storeData?.cart || { items: [] };
  // const addresses = storeData?.addresses || [];
  const wishlist = storeData?.wishlist || [];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row text-slate-900 antialiased font-sans">
      {/* SIDEBAR NAVIGATION CONTROL */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col px-4 py-6 justify-between shrink-0">
        <div className="space-y-6">
          <div className="px-2 flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <span>StoreFront UI</span>
          </div>

          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left border-0 bg-transparent cursor-pointer ${
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
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left border-0 bg-transparent cursor-pointer ${
                activeTab === "orders"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              My Purchases
              {orders.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-auto bg-slate-100 text-slate-700"
                >
                  {orders.length}
                </Badge>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left border-0 bg-transparent cursor-pointer ${
                activeTab === "wishlist"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Heart className="w-4 h-4" />
              My Wishlist
              {wishlist.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-auto bg-slate-100 text-slate-700"
                >
                  {wishlist.length}
                </Badge>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left border-0 bg-transparent cursor-pointer ${
                activeTab === "profile"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User className="w-4 h-4" />
              Account Settings
            </button>
          </nav>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-slate-200 text-slate-600 hover:text-red-600 justify-start gap-2 h-9 text-xs shadow-none"
        >
          <LogOut className="w-4 h-4" />
          Logout Account
        </Button>
      </aside>

      {/* PRIMARY WORKSPACE MAIN FEED CONTAINER */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 max-w-6xl mx-auto w-full space-y-8">
        {/* TOP GREETING INFRASTRUCTURE HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Welcome, {profile?.fullname || "Customer"}!
            </h2>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              Manage your e-commerce interactions, purchase tracks, and account
              parameters.
            </p>
          </div>
          <Badge
            className={`px-2.5 py-1 text-xs font-semibold gap-1.5 self-start sm:self-center border shadow-none ${
              profile?.isVerified
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {profile?.isVerified ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5" />
            )}
            {profile?.isVerified
              ? "Verified Profile"
              : "Awaiting Email Verification"}
          </Badge>
        </header>
        {/* VIEW TAB A: ACCOUNT OVERVIEW METRICS ROWS */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-white shadow-sm border-slate-200/80">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Spent
                  </CardTitle>
                  <ShoppingBag className="w-4 h-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    $
                    {orders
                      .reduce(
                        (sum, o) =>
                          sum + (o.status === "Paid" ? o.grandTotal : 0),
                        0,
                      )
                      .toFixed(2)}
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">
                    Sum of all completed purchase payments
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm border-slate-200/80">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Items in Basket
                  </CardTitle>
                  <ShoppingCart className="w-4 h-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {cart?.items?.length || 0} Products
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline cursor-pointer border-0 bg-transparent p-0 mt-1"
                  >
                    Proceed to checkout clearance ➔
                  </button>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm border-slate-200/80">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Saved Favorites
                  </CardTitle>
                  <Heart className="w-4 h-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {wishlist.length} Items
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">
                    Products saved to your wishlist book
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-slate-200/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Account Context
                  Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Account Identity Code</span>{" "}
                  <span className="font-mono font-semibold text-slate-600">
                    {profile?._id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">
                    Registered Email Address
                  </span>{" "}
                  <span className="font-medium text-slate-900">
                    {profile?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-400">System Permission Tier</span>{" "}
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                    {profile?.role || "customer"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* VIEW TAB B: HISTORICAL PURCHASES TABLE DATA LOGS */}
        {activeTab === "orders" && (
          <Card className="bg-white border-slate-200 shadow-sm animate-in fade-in duration-200">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Purchase Order Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-400 font-medium">
                  No purchase transactions logged under this identity.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 hover:bg-transparent">
                      <TableHead className="text-xs font-bold uppercase tracking-wider">
                        Transaction ID
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">
                        Date Placed
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">
                        Destination
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">
                        Gross Total
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">
                        Logistics State
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order._id}
                        className="border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="font-mono text-xs font-semibold text-slate-500">
                          #{order._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-600 h-10 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 truncate max-w-[140px]">
                          {order.shippingAddress?.city || "N/A"},{" "}
                          {order.shippingAddress?.state || ""}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-slate-900">
                          ${order.grandTotal?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`px-2 py-0.5 text-[10px] font-bold shadow-none ${
                              order.status === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* VIEW TAB C: SAVED WISHLIST COMPONENT INTERFACE */}
        {activeTab === "wishlist" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Saved Wishlist Items
            </h3>
            {wishlist.length === 0 ? (
              <div className="border border-dashed border-slate-200 bg-white rounded-xl p-12 text-center text-slate-400 text-sm font-medium">
                Your wishlist queue is currently empty.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishlist.map((item) => (
                  <Card
                    key={item._id}
                    className="bg-white border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="bg-slate-50 border border-slate-100/50 rounded-lg h-36 overflow-hidden flex items-center justify-center relative">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={
                              Array.isArray(item.images)
                                ? item.images
                                : item.images
                            }
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-slate-200" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-slate-900 truncate capitalize">
                          {item.name || "E-Commerce Product"}
                        </h4>
                        <p className="text-xs font-black text-indigo-600">
                          ${item.price ? item.price.toFixed(2) : "0.00"}
                        </p>
                      </div>
                    </CardContent>
                    <Separator className="bg-slate-100" />
                    <div className="p-2 flex gap-2 bg-slate-50/30">
                      <Button
                        onClick={() => handleMoveToCart(item._id)}
                        className="w-full h-8 text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-none font-bold"
                      >
                        Move to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleToggleWishlist(item._id, true)}
                        className="h-8 text-xs text-red-600 border-red-100 hover:bg-red-50 px-2 shadow-none rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW TAB D: PROFILE & SECURITY CHANGE PASSWORD SUB-VIEW SUB-VIEW */}
        {activeTab === "profile" && (
          <ProfileView
            userContextData={storeData}
            onRefreshProfileData={pullDashboardPayload}
          />
        )}
      </main>
    </div>
  );
};
