import React from "react";
// import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // const isLoggedIn = useSelector((state) => state.user.value.isLoggedIn);
  const isLoggedIn = !!localStorage.getItem("access-token");

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
