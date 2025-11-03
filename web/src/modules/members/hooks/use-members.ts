import { listMembers } from "@/http/list-members";
import { useQuery } from "@tanstack/react-query";

export const useMembers = (orgSlug: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["members", orgSlug],
    queryFn: () => listMembers({ slug: orgSlug! }),
  });

  return { members: data || [], loading: isPending };
};
