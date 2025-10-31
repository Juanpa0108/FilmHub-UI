import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../API/authContext";

/**
 * ProtectedRoute
 * Wrap routes that require authentication. If the user isn't authenticated,
 * redirect to /login and preserve the intended destination in state.
 */
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
