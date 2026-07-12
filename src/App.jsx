//import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RegisterView } from "./views/RegisterView";
import { ProtectedRoute } from "./routes/protectedRoutes";
import { VerifyEmailView } from "./views/VerifyEmailView";
import { EmailSentNotificationView } from "./views/EmailSentNotificationView";
import { LoginView } from "./views/LoginView";
import { ForgotPasswordView } from "./views/ForgotPasswordView";
import { ResetPasswordView } from "./views/ResetPasswordView";
import { DashboardView } from "./views/DashboardView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Application Routes */}
        <Route path="/register" element={<RegisterView />} />
        <Route path="/verify-email" element={<VerifyEmailView />} />
        <Route path="/email-sent" element={<EmailSentNotificationView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/forgot-password" element={<ForgotPasswordView />} />
        <Route path="/reset-password" element={<ResetPasswordView />} />

        {/* 8. Secured Protected Application Ecosystem Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route
            path="/profile"
            element={
              <div className="p-8 text-center">9. User Profile Page</div>
            }
          />
        </Route>

        {/* Catch-all Fallback Redirect routing block */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
