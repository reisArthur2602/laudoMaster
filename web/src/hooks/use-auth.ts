import { getUserProfile } from "@/http/get-user-profile";
import { queryClient } from "@/main";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { useNavigate } from "react-router";

export const useAuth = () => {
  const navigate = useNavigate();
  const token = Cookies.get("laudoMaster_token");

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
    enabled: !!token,
    retry: false,
  });

  const logout = () => {
    queryClient.clear();
    Cookies.remove("laudoMaster_token");
    navigate("/", { replace: true });
  };

  const loading = !!token && (isPending || isFetching);
  const user = data ?? null;
  return {
    user,
    loading,
    authenticated: !!user,
    logout,
  };
};
