import { Header } from "@/components/header";
import { Tabs } from "@/components/ui/tabs";

const links = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/dashboard/settings", label: "Configurações" },
];
export const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Tabs links={links} />
      <main className="mx-auto container p-6 flex-1">Overview</main>
    </div>
  );
};
