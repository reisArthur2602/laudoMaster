import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { AppLoading } from "./app-loading";

export const Dashboardlayout = () => {
  const { authenticated, loading } = useAuth();

  if (loading) return <AppLoading />;

  if (!authenticated) return <Navigate to="/" replace />;

  return (
    <div className="h-dvh flex flex-col">
      <Outlet />
    </div>
  );
};
