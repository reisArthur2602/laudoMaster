import { listOrgStudies } from "@/http/list-studies";
import { useQuery } from "@tanstack/react-query";

export const useStudies = (orgSlug: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["studies", orgSlug],
    queryFn: () => listOrgStudies({ slug: orgSlug }),
  });

  return { studies: data || [], loading: isPending };
};
