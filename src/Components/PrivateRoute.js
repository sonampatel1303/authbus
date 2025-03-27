import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

// PrivateRoute component to protect certain routes
const PrivateRoute = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    // If the user is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
  
    return <Navigate to="/" />;
  }


  return <Outlet />;
};

export default PrivateRoute;