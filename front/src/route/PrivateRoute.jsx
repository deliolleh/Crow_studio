import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.value.isLoggedIn);

  if (isLoggedIn) {
    return children;
  }
  return <Navigate to="/" replace />;
};

export default PrivateRoute;
