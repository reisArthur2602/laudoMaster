import { usePermission } from '@/hooks/use-permission';
import { listOrgStudies } from '@/http/list-studies';
import { useQuery } from '@tanstack/react-query';

export const useStudies = (orgSlug: string) => {
    const { role, loading: loadingRole } = usePermission(orgSlug!);

    const getStudyType = (role: Roles | null): StudyType | undefined => {
        switch (role) {
            case 'ADMIN':
                return undefined;
            case 'LAUDO':
                return 'ORTHANC';
            case 'TECHNICAL':
                return 'EXTERNAL';
        }
    };

    const type = getStudyType(role);

    const { data, isPending } = useQuery({
        queryKey: ['studies', orgSlug, type],
        queryFn: () => listOrgStudies({ slug: orgSlug, type }),
        enabled: !loadingRole,
        staleTime: 1000 * 60 * 10,
    });

    return {
        studies: data || [],
        loading: isPending || loadingRole,
    };
};
