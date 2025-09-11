import type { RouteObject } from "react-router-dom";
import Layout from "../components/layout";
import Dashboard from "../pages/dashboard";
import "tailwindcss";
import Admin_invoice from "../pages/admin-invoice";
import User_invoice from "../pages/user-invoice";
import Auth from "../pages/auth";

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
       { path: "/", element: <Auth/> },
       
      { path: "/admin-invoice", element: <Admin_invoice /> },
      { path: "/user-invoice", element: <User_invoice /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
];

export default routes;
