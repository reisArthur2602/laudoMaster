import { listDoctors } from "@/http/list-doctors";
import { useQuery } from "@tanstack/react-query";

export const useDoctors = (orgSlug: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["doctors", orgSlug],
    queryFn: () => listDoctors({ slug: orgSlug! }),
  });

  return { doctors: data || [], loading: isPending };
};
