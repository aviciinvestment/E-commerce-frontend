import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProfileController } from "../controllers/useProfileController";
import { useOrderHistoryController } from "../controllers/useOrderHistoryController";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Loader2,
  ShoppingBag,
  LayoutDashboard,
  ShoppingCart,
  LogOut,
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  Package,
  DollarSign,
  Clock,
  XCircle,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ProfileSettings } from "./ProfileView";

const STATUS_COLORS = {
  PendingPayment: "#f59e0b",
  Paid: "#10b981",
  Processing: "#6366f1",
  Shipped: "#0ea5e9",
  Delivered: "#10b981",
  Cancelled: "#94a3b8",
  ReturnRequested: "#f97316",
};

const STATUS_BADGE_STYLES = {
  PendingPayment: "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Shipped: "bg-sky-50 text-sky-700 border-sky-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  ReturnRequested: "bg-orange-50 text-orange-700 border-orange-200",
};

const CANCELLABLE_STATUSES = ["PendingPayment", "Paid", "Processing"];

export const DashboardView = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const {
    loading,
    addresses,
    profile,
    syncAccountDataMatrix,
    hasExecutedRef,
    fullname,
    setFullname,
    email,
    setEmail,
    handleUpdateInfoSubmit,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleChangePasswordSubmit,
    street,
    setStreet,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    country,
    setCountry,
    addressModalOpen,
    setAddressModalOpen,
    editingAddressId,
    openAddressFormModal,
    handleSaveAddressSubmit,
    handleDeleteAddressTrigger,
  } = useProfileController();

  const {
    orders,
    loading: ordersLoading,
    busyIds,
    cancelOrder,
  } = useOrderHistoryController();

  useEffect(() => {
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      syncAccountDataMatrix();
    }
  }, []);

  // Derived purchase analytics — computed once whenever the orders list changes
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const pendingCount = orders.filter((o) =>
      ["PendingPayment", "Processing"].includes(o.status),
    ).length;
    const deliveredCount = orders.filter(
      (o) => o.status === "Delivered",
    ).length;
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    const statusChartData = Object.entries(statusCounts).map(
      ([status, count]) => ({ status, count }),
    );

    return {
      totalOrders,
      totalSpent,
      pendingCount,
      deliveredCount,
      avgOrderValue,
      statusChartData,
    };
  }, [orders]);

  const handleLogoutClick = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Re-indexing account ecosystem...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col md:flex-row text-slate-900 antialiased font-sans">
      {/* SIDEBAR VIEW HUB PANEL */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col px-4 py-6 justify-between shrink-0">
        <div className="space-y-6">
          <div className="px-2 flex items-center gap-2 font-black text-lg text-slate-900 tracking-tight">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <span>VictoryCommerce</span>
          </div>

          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left border-0 bg-transparent cursor-pointer ${activeTab === "overview" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Shopping Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left border-0 bg-transparent cursor-pointer ${activeTab === "profile" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <User className="w-4 h-4" />
              My Profile Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("purchases")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left border-0 bg-transparent cursor-pointer ${activeTab === "purchases" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <ShoppingCart className="w-4 h-4" />
              Purchases
            </button>
          </nav>
        </div>
        <Button
          onClick={handleLogoutClick}
          variant="outline"
          className="w-full border-slate-200 text-slate-600 hover:text-red-600 justify-start gap-2 h-9 text-xs shadow-none font-bold"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </aside>

      {/* CORE FRAME CONTAINER VIEW */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 max-w-6xl mx-auto w-full space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              Account Control Dashboard
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Hello,{" "}
              <span className="text-indigo-600 font-bold">
                {profile?.fullname}
              </span>
              ! Manage credentials parameters files below.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-slate-200 text-xs gap-1.5 font-bold shadow-none rounded-lg"
              >
                <Home className="w-3.5 h-3.5" /> Return Home
              </Button>
            </Link>
            <Badge className="px-2.5 py-1 text-[10px] font-bold gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none uppercase rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> Secured Sync
            </Badge>
          </div>
        </header>

        {/* SHOPPING OVERVIEW TAB — real profile details + quick stats */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Account details card */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shrink-0">
                  {profile?.fullname?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-lg font-black text-slate-900 truncate">
                    {profile?.fullname || "—"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {profile?.email || "—"}
                  </div>
                  {profile?.createdAt && (
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      Member since{" "}
                      {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => setActiveTab("profile")}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-bold rounded-lg border-slate-200 shrink-0"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Package className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Total Orders
                    </span>
                  </div>
                  <p className="text-xl font-black text-slate-900">
                    {ordersLoading ? "—" : stats.totalOrders}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Total Spent
                    </span>
                  </div>
                  <p className="text-xl font-black text-slate-900">
                    {ordersLoading ? "—" : `$${stats.totalSpent.toFixed(2)}`}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Saved Addresses
                    </span>
                  </div>
                  <p className="text-xl font-black text-slate-900">
                    {addresses?.length ?? 0}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      In Progress
                    </span>
                  </div>
                  <p className="text-xl font-black text-slate-900">
                    {ordersLoading ? "—" : stats.pendingCount}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent orders preview */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">
                    Recent Orders
                  </h3>
                  <Button
                    onClick={() => setActiveTab("purchases")}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-bold text-indigo-600 gap-1 px-2"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {ordersLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 rounded-lg bg-slate-100 animate-pulse"
                      />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-xs font-semibold text-slate-400 text-center py-6">
                    No orders placed yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 3).map((order) => (
                      <Link
                        key={order._id}
                        to={`/orders/${order._id}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <Badge
                            className={`text-[9px] font-bold uppercase px-1.5 rounded border ${STATUS_BADGE_STYLES[order.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <span className="text-xs font-black text-slate-900">
                          ${order.grandTotal?.toFixed(2)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* PROFILE SETTINGS TAB — untouched */}
        {activeTab === "profile" && (
          <ProfileSettings
            loading={loading}
            addresses={addresses}
            fullname={fullname}
            setFullname={setFullname}
            email={email}
            setEmail={setEmail}
            handleUpdateInfoSubmit={handleUpdateInfoSubmit}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleChangePasswordSubmit={handleChangePasswordSubmit}
            street={street}
            setStreet={setStreet}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            zipCode={zipCode}
            setZipCode={setZipCode}
            country={country}
            setCountry={setCountry}
            addressModalOpen={addressModalOpen}
            setAddressModalOpen={setAddressModalOpen}
            editingAddressId={editingAddressId}
            openAddressFormModal={openAddressFormModal}
            handleSaveAddressSubmit={handleSaveAddressSubmit}
            handleDeleteAddressTrigger={handleDeleteAddressTrigger}
          />
        )}

        {/* PURCHASES TAB — real analytics dashboard tied to GetUserOrders */}
        {activeTab === "purchases" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {ordersLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Package className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Total Orders
                        </span>
                      </div>
                      <p className="text-xl font-black text-slate-900">
                        {stats.totalOrders}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Total Spent
                        </span>
                      </div>
                      <p className="text-xl font-black text-slate-900">
                        ${stats.totalSpent.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Avg Order Value
                        </span>
                      </div>
                      <p className="text-xl font-black text-slate-900">
                        ${stats.avgOrderValue.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Delivered
                        </span>
                      </div>
                      <p className="text-xl font-black text-slate-900">
                        {stats.deliveredCount}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {orders.length === 0 ? (
                  <Card className="bg-white border-dashed border-slate-200 rounded-2xl">
                    <CardContent className="p-16 text-center space-y-3">
                      <Package className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-semibold text-slate-400">
                        You haven't placed any orders yet.
                      </p>
                      <Link to="/shop">
                        <Button
                          size="sm"
                          className="bg-slate-900 hover:bg-slate-800 text-xs font-bold h-8 px-4 rounded-lg"
                        >
                          Browse Catalog
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Status breakdown chart */}
                    <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden lg:col-span-1">
                      <CardContent className="p-5 space-y-2">
                        <h3 className="text-sm font-black text-slate-900">
                          Orders by Status
                        </h3>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stats.statusChartData}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={75}
                                paddingAngle={2}
                              >
                                {stats.statusChartData.map((entry) => (
                                  <Cell
                                    key={entry.status}
                                    fill={
                                      STATUS_COLORS[entry.status] || "#cbd5e1"
                                    }
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  fontSize: "11px",
                                  borderRadius: "8px",
                                  border: "1px solid #e2e8f0",
                                }}
                              />
                              <Legend
                                wrapperStyle={{ fontSize: "10px" }}
                                iconSize={8}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Full order list */}
                    <div className="lg:col-span-2 space-y-3">
                      {orders.map((order) => {
                        const isBusy = busyIds.has(order._id);
                        const canCancel = CANCELLABLE_STATUSES.includes(
                          order.status,
                        );
                        const statusStyle =
                          STATUS_BADGE_STYLES[order.status] ||
                          "bg-slate-100 text-slate-500 border-slate-200";

                        return (
                          <Card
                            key={order._id}
                            className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
                          >
                            <CardContent className="p-4 flex items-center justify-between gap-4">
                              <Link
                                to={`/orders/${order._id}`}
                                className="flex-1 min-w-0 flex items-center gap-3"
                              >
                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 shrink-0">
                                  <Package className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-900">
                                      #{order._id.slice(-8).toUpperCase()}
                                    </span>
                                    <Badge
                                      className={`text-[9px] font-bold uppercase px-1.5 rounded border ${statusStyle}`}
                                    >
                                      {order.status}
                                    </Badge>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-medium">
                                    {new Date(
                                      order.createdAt,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}{" "}
                                    · {order.items?.length || 0} item
                                    {order.items?.length === 1 ? "" : "s"}
                                  </p>
                                </div>
                              </Link>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-sm font-black text-slate-900">
                                  ${order.grandTotal?.toFixed(2)}
                                </span>

                                {canCancel && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={isBusy}
                                    onClick={() => cancelOrder(order._id)}
                                    className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50/50"
                                    aria-label="Cancel order"
                                  >
                                    {isBusy ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
