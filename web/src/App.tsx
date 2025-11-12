import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginPage } from "./modules/login";
import { NotFoundPage } from "./modules/not-found";
import { DashboardPage } from "./modules/dashboard";
import { Dashboardlayout } from "./components/dashboard-layout";
import { OrganizationLayout } from "./components/organization-layout";
import { OrganizationPage } from "./modules/dashboard/org";
import { StudiesPage } from "./modules/dashboard/org/studies";
import { PatientsPage } from "./modules/dashboard/org/patients";
import { SettingsPage } from "./modules/dashboard/settings";
import { MembersPage } from "./modules/dashboard/org/members";
import { EquipmentsPage } from "./modules/dashboard/org/equipments";
import { PatientPage } from "./modules/dashboard/org/patients/patient";
import { PatientPage as PatientClinicPage } from "./modules/patient";
import { ErrorPage } from "./modules/error";
import { DoctorsPage } from "./modules/dashboard/org/doctors";
import { ExamsPage } from "./modules/patient/exams";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/patient",

    children: [
      {
        index: true,
        element: <PatientClinicPage />,
      },
      {
        path: "exams",
        element: <ExamsPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboardlayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "settings",
        element: <SettingsPage />,
      },
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
          { path: `doctors`, element: <DoctorsPage /> },
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
