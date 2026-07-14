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

// Easy view placeholders for your dynamic layout child nodes

const ShopPlaceholder = () => (
  <div className="p-8 text-center bg-white border rounded-xl shadow-sm">
    🛍️ Product Catalog Filtering Grid Pipeline
  </div>
);
const CartPlaceholder = () => (
  <div className="p-8 text-center bg-white border rounded-xl shadow-sm">
    🛒 Active Shopping Cart Checkout Ledger
  </div>
);
const DashboardPlaceholder = () => (
  <div className="p-8 text-center bg-white border rounded-xl shadow-sm text-emerald-600 font-bold">
    🎉 Secure User Ecosystem Dashboard Panel Active
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
          <Route path="shop" element={<ShopPlaceholder />} />
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
          {/* Direct your protected sub-views through your layout shell */}
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          <Route
            path="/profile"
            element={<div className="p-8">Customer Profile Section</div>}
          />
        </Route>

        {/* ⚡ FIXED: Safe catch-all fallback bounce gate redirects cleanly to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
