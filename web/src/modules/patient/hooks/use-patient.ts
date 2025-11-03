import { useQuery } from "@tanstack/react-query";
import { getPatient } from "@/http/get-patient";

export const usePatient = (orgSlug: string, patientId: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["patient", orgSlug, patientId],
    queryFn: () => getPatient({ slug: orgSlug, patientId }),
    enabled: !!orgSlug && !!patientId,
  });

  return {
    patient: data ?? null,
    loading: isPending,
  };
};
