import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../components/custom/MainLayout";

// Mock views for foundation validation testing
const HomePlaceholder = () => (
  <div className="p-8 text-center text-slate-600 bg-white rounded-xl border border-slate-200">
    🏠 Marketplace Product Showcase Catalog Coming Soon
  </div>
);
const LoginPlaceholder = () => (
  <div className="p-8 text-center text-slate-600 bg-white rounded-xl border border-slate-200">
    🔐 Full Authentication Interface Shell Active
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 2. Global Layout structural wrapper boundary */}
      <Route path="/" element={<MainLayout />}>
        {/* Child Views injected cleanly via the Layout Outlet */}
        <Route index element={<HomePlaceholder />} />
        <Route
          path="shop"
          element={
            <div className="text-center py-12 font-bold text-slate-800">
              🛍️ Product Catalog Pipeline Grid
            </div>
          }
        />
        <Route
          path="cart"
          element={
            <div className="text-center py-12 font-bold text-slate-800">
              🛒 Shopping Cart Ledger Panel
            </div>
          }
        />
        <Route path="login" element={<LoginPlaceholder />} />

        {/* Fallback Redirect parameters configuration */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
