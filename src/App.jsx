import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RegisterView } from "./views/RegisterView";
import { ProtectedRoute } from "./routes/protectedRoutes";
import { VerifyEmailView } from "./views/VerifyEmailView";
import { EmailSentNotificationView } from "./views/EmailSentNotificationView";
import { LoginView } from "./views/LoginView";
import { ForgotPasswordView } from "./views/ForgotPasswordView";
import { ResetPasswordView } from "./views/ResetPasswordView";
import { MainLayout } from "./components/custom/MainLayout"; // ⚡ Import your Phase 1 structural layout
import { Toaster } from "./components/ui/sonner"; // ⚡ Moved up so alerts work everywhere
import { HomeView } from "./views/HomeView";
import { ShopView } from "./views/ShopView"; // ⚡ Import the clean view file
// 1. Import your brand new DashboardView layout file cleanly
import { DashboardView } from "./views/DashboardView";

import { ProductDetailView } from "./views/ProductDetailView"; // ⚡ Import the clean view file

// Easy view placeholders for your dynamic layout child nodes

const CartPlaceholder = () => (
  <div className="p-8 text-center bg-white border rounded-xl shadow-sm">
    🛒 Active Shopping Cart Checkout Ledger
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* ⚡ Placed globally so notifications show up on auth forms AND dashboard pages */}
      <Toaster position="top-right" richColors />

      <Routes>
        {/* ─────────────────────────────────────────────────────────
            PUBLIC VIEWS WRAPPED INSIDE GLOBAL NAVIGATION LAYOUT
            ───────────────────────────────────────────────────────── */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomeView />} />

          <Route path="shop" element={<ShopView />} />

          <Route path="product/:productId" element={<ProductDetailView />} />
          <Route path="cart" element={<CartPlaceholder />} />
          {/* Public Auth Pathways */}
          <Route path="register" element={<RegisterView />} />
          <Route path="verify-email" element={<VerifyEmailView />} />
          <Route path="email-sent" element={<EmailSentNotificationView />} />
          <Route path="login" element={<LoginView />} />
          <Route path="forgot-password" element={<ForgotPasswordView />} />
          <Route path="reset-password" element={<ResetPasswordView />} />
        </Route>

        {/* ─────────────────────────────────────────────────────────
            SECURED ECYOSYSTEM SUB-PATHS GUARD
            ───────────────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            {/* Direct your protected sub-views through your layout shell */}
            <Route path="/dashboard" element={<DashboardView />} />
          </Route>
        </Route>

        {/* ⚡ FIXED: Safe catch-all fallback bounce gate redirects cleanly to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
