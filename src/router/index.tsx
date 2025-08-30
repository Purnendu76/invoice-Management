import type { RouteObject } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../pages/home";
import About from "../pages/about";
import Dashboard from "../pages/dashboard";
import "tailwindcss";

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/", element: <Dashboard /> },
    ],
  },
];

export default routes;
