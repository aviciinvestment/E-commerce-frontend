//import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  // Read if the JWT session key token currently exists in memory
  const isAuthenticated = !!localStorage.getItem("accessToken");

  // If unauthorized, intercept and bounce them out to the public login screen
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
