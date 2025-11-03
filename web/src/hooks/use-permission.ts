import { getMyMembership } from "@/http/get-my-membership";
import { useQuery } from "@tanstack/react-query";

export const usePermission = (orgSlug: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["org-permissions", orgSlug],
    queryFn: () => getMyMembership({ slug: orgSlug }),
    enabled: !!orgSlug,
  });

  const role = data?.role ?? null;

  const hasPermission = (allowed: Roles[]) => {
    if (!role) return false;
    return allowed.includes(role);
  };

  return { hasPermission, loading: isLoading, role };
};
