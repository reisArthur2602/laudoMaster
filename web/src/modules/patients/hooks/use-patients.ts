import { listOrgPatients } from "@/http/list-org-patients";
import { useQuery } from "@tanstack/react-query";

export const usePatients = (orgSlug: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["patients", orgSlug],
    queryFn: () => listOrgPatients({ slug: orgSlug! }),
  });

  return { patients: data || [], loading: isPending };
};
