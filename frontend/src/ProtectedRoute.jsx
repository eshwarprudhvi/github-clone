import React, { useContext } from "react";
import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

export default ProtectedRoute;
