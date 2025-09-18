import type { RouteObject } from "react-router-dom";
import Layout from "../components/layout";
import Dashboard from "../pages/dashboard";
import "tailwindcss";
import Admin_invoice from "../pages/admin-invoice";
import User_invoice from "../pages/user-invoice";
import Register from "../pages/regester";
import Auth from "../pages/auth";

const routes: RouteObject[] = [
  // ✅ Auth route outside Layout
  { path: "/", element: <Auth /> },
  { path: "/register", element: <Register /> },

  // ✅ Protected routes under Layout
  {
    element: <Layout />,
    children: [
      { path: "/admin-invoice", element: <Admin_invoice /> },
      { path: "/user-invoice", element: <User_invoice /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
];

export default routes;
