import type { RouteObject } from "react-router-dom";
import Layout from "../components/layout";
import Dashboard from "../pages/dashboard";
import Admin_invoice from "../pages/admin-invoice";
import User_invoice from "../pages/user-invoice";
import Register from "../pages/regester";
import Auth from "../pages/auth";
import PrivateRoute from "../components/PrivateRoute";

const routes: RouteObject[] = [
  { path: "/", element: <Auth /> },
  { path: "/register", element: <Register /> },

  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute allowedRoles={["Admin", "user"]}>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin-invoice",
        element: (
          <PrivateRoute allowedRoles={["Admin"]}>
            <Admin_invoice />
          </PrivateRoute>
        ),
      },
      {
        path: "/user-invoice",
        element: (
          <PrivateRoute allowedRoles={["user", "Admin"]}>
            <User_invoice />
          </PrivateRoute>
        ),
      },
    ],
  },
];

export default routes;
