import { Navigate, Outlet, useParams } from "react-router";
import { Header } from "./header";
import { AppLoading } from "./app-loading";

import { usePermission } from "@/hooks/use-permission";
import { Tabs, type TabsLinks } from "./ui/tabs";

export const OrganizationLayout = () => {
  const { orgSlug } = useParams();
  const { hasPermission, loading, role } = usePermission(orgSlug!);

  const prefix = `/dashboard/${orgSlug}/`;

  const links: TabsLinks[] = [
    { href: prefix, label: "Visão Geral", allowed: ["MEMBER", "SUPER_ADMIN"] },
    {
      href: prefix + "studies",
      label: "Exames",
      allowed: ["MEMBER", "SUPER_ADMIN"],
    },
    {
      href: prefix + "patients",
      label: "Pacientes",
      allowed: ["MEMBER", "SUPER_ADMIN"],
    },
    { href: prefix + "members", label: "Membros", allowed: ["SUPER_ADMIN"] },
    {
      href: prefix + "equipments",
      label: "Equipamentos",
      allowed: ["SUPER_ADMIN"],
    },
  ];

  if (loading) return <AppLoading />;
  if (!role) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <Header />
      <Tabs links={links} currentRole={role} checkPermission={hasPermission} />
      <main className="mx-auto container p-6 mt-4 flex-1">
        <Outlet />
      </main>
    </>
  );
};
