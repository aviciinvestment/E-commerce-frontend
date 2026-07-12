//import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RegisterView } from "./views/RegisterView";
import { ProtectedRoute } from "./routes/protectedRoutes";
import { VerifyEmailView } from "./views/VerifyEmailView";
import { EmailSentNotificationView } from "./views/EmailSentNotificationView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Application Routes */}
        <Route path="/register" element={<RegisterView />} />
        <Route path="/verify-email" element={<VerifyEmailView />} />
        <Route path="/email-sent" element={<EmailSentNotificationView />} />
        <Route
          path="/login"
          element={
            <div className="p-8 text-center">login View Placeholder</div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <div className="p-8 text-center">
              Forgot Password View Placeholder
            </div>
          }
        />

        {/* 8. Secured Protected Application Ecosystem Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <div className="p-8 text-center text-emerald-600 font-bold">
                🎉 Welcome to your Protected Account User Dashboard Screen!
              </div>
            }
          />
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
