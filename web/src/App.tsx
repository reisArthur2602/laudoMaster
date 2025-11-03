import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginPage } from "./modules/login";
import { NotFoundPage } from "./modules/not-found";
import { DashboardPage } from "./modules/dashboard";
import { Dashboardlayout } from "./components/dashboard-layout";
import { OrganizationLayout } from "./components/organization-layout";
import { OrganizationPage } from "./modules/org";
import { StudiesPage } from "./modules/studies";
import { PatientsPage } from "./modules/patients";
import { SettingsPage } from "./modules/settings";
import { MembersPage } from "./modules/members";
import { EquipmentsPage } from "./modules/equipments";
import { PatientPage } from "./modules/patient";
import { ErrorPage } from "./modules/error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboardlayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "settings", element: <SettingsPage /> },
      {
        path: `/dashboard/:orgSlug`,
        element: <OrganizationLayout />,
        children: [
          { index: true, element: <OrganizationPage /> },
          { path: `studies`, element: <StudiesPage /> },
          { path: `patients`, element: <PatientsPage /> },
          { path: `patients/:patientId`, element: <PatientPage /> },

          { path: `members`, element: <MembersPage /> },
          { path: `equipments`, element: <EquipmentsPage /> },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <ErrorPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
