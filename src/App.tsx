import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "./router";

function RoutesWrapper() {
  

  return useRoutes(routes);
}

export default function App() {
  return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>
  );
}
