import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./modules/login";
import { NotFoundPage } from "./modules/not-found";
import DashboardPage from "./modules/dashboard";
import { Dashboardlayout } from "./components/dashboard-layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboardlayout />,
    children: [{ path: "", element: <DashboardPage /> }],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
