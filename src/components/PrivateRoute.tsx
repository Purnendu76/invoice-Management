import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// Define props type
type PrivateRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<"Admin" | "user">; // Adjust roles as needed
};

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const token = Cookies.get("token");
  const role = token ? JSON.parse(atob(token.split(".")[1]))?.role : null;

  if (!token || (allowedRoles && !allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // wrap in fragment to satisfy JSX
}
