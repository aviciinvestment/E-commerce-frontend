import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProfileController } from "../controllers/useProfileController";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Loader2,
  ShoppingBag,
  LayoutDashboard,
  Heart,
  ShoppingCart,
  LogOut,
  CheckCircle2,
  Home,
} from "lucide-react";
import { ProfileSettings } from "./ProfileView";

export const DashboardView = () => {
  const [activeTab, setActiveTab] = useState("profile");
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

  useEffect(() => {
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      syncAccountDataMatrix();
    }
  }, []);

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
              onClick={() => setActiveTab("overview-placeholder")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left border-0 bg-transparent cursor-pointer ${activeTab === "overview-placeholder" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Store Overview
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed border-0 bg-transparent text-left"
            >
              <ShoppingCart className="w-4 h-4 text-slate-200" />
              Purchases (Pending)
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed border-0 bg-transparent text-left"
            >
              <Heart className="w-4 h-4 text-slate-200" />
              Wishlist (Pending)
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

        {/* ANALYTICS PLACEHOLDER CONTAINER */}
        {activeTab === "overview-placeholder" && (
          <div className="border border-dashed border-slate-200 bg-white rounded-2xl p-16 text-center text-slate-400 text-xs font-semibold animate-in fade-in duration-150">
            📊 Marketplace Transaction Analytics Dashboard Shell Active
            (Placeholder Queue)
          </div>
        )}
      </main>
    </div>
  );
};
