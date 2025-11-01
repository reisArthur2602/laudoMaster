import { getUserProfile } from "@/http/get-user-profile";
import { queryClient } from "@/main";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { useNavigate } from "react-router";

export const useAuth = () => {
  const navigate = useNavigate();
  const token = Cookies.get("laudoMaster_token");

  const {
    data: user,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["user-session"],
    queryFn: getUserProfile,
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });

  const logout = () => {
    queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    Cookies.remove("laudoMaster_token");
    navigate("/login", { replace: true });
  };

  const loading = !!token && (isPending || isFetching);

  return {
    user,
    loading,
    authenticated: !!user,
    logout,
  };
};
