import { Navigate, Outlet } from "react-router";
import { Spinner } from "./ui/spinner";
import { useAuth } from "@/hooks/use-auth";

export const Dashboardlayout = () => {
  const { authenticated, loading } = useAuth();

  if (loading)
    return (
      <div className="text-muted-foreground flex h-screen items-center justify-center">
        <div className="flex items-center gap-4">
          <Spinner />
        </div>
      </div>
    );

  if (!authenticated) return <Navigate to="/" replace />;

  return (
    <div>
      <Outlet />
    </div>
  );
};
