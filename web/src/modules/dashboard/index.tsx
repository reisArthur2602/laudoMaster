import { Header } from "@/components/header";

import { Tabs } from "@/components/tabs";

const links = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/dashboard/settings", label: "Configurações" },
];

export const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Tabs links={links} />

      <main className="mx-auto max-w-[1200px] w-full p-6 mt-4 flex-1">
        Overview
      </main>
    </div>
  );
};
