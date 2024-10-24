import React from "react";
import { Navigate, Outlet } from "react-router-dom";
function PrivateRoutes() {
  const isAuth = JSON.parse(localStorage.getItem("auth"))?.isAuth || undefined;
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
