import { useQuery } from "@tanstack/react-query";
import { usePermission } from "@/hooks/use-permission";
import { listOrgStudies } from "@/http/list-studies";

export const useStudies = (orgSlug: string) => {
  const { role, loading: loadingRole } = usePermission(orgSlug!);

  const getStudyType = (role: Roles | null): StudyType | undefined => {
    switch (role) {
      case "ADMIN":
        return undefined;
      case "LAUDO":
        return "ORTHANC";
      case "TECHNICAL":
        return "EXTERNAL";
    }
  };

  const type = getStudyType(role);

  const { data, isPending } = useQuery({
    queryKey: ["studies", orgSlug, type],
    queryFn: () => listOrgStudies({ slug: orgSlug, type }),
    enabled: !loadingRole,
  });

  return {
    studies: data || [],
    loading: isPending || loadingRole,
  };
};
