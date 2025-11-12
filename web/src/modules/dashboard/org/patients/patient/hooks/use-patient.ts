import { getPatient } from '@/http/get-patient';
import { useQuery } from '@tanstack/react-query';

export const usePatient = (orgSlug: string, patientId: string) => {
    const { data, isPending } = useQuery({
        queryKey: ['patient', orgSlug, patientId],
        queryFn: () => getPatient({ slug: orgSlug, patientId }),
        enabled: !!orgSlug && !!patientId,
        staleTime: 1000 * 60 * 10,
    });

    return {
        patient: data ?? null,
        loading: isPending,
    };
};
