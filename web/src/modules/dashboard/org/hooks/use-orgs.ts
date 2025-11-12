import { listOrgStudies } from '@/http/list-studies';
import { useQuery } from '@tanstack/react-query';

export const useOrgData = (orgSlug: string) => {
    const { data, isPending } = useQuery({
        queryKey: ['studies-pending', orgSlug],
        queryFn: () => listOrgStudies({ slug: orgSlug, status: 'PENDING' }),
        staleTime: 1000 * 60,
    });

    return {
        studies: data || [],
        loading: isPending,
    };
};



// 
