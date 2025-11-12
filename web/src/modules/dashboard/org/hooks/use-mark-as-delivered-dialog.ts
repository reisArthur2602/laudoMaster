import { updateStudyStatus } from '@/http/update-study-status';
import { queryClient } from '@/main';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useMarkAsDeliveredDialog = (orgSlug: string) => {
    const { mutateAsync: markDeliveredMutation } = useMutation({
        mutationFn: updateStudyStatus,
        onSuccess: () => {
            toast.success('Exame marcado como entregue!');
            queryClient.invalidateQueries({ queryKey: ['studies-pending', orgSlug] });
        },
    });

    const onMarkDelivered = async (studyId: string) => {
        await markDeliveredMutation({ studyId, status: 'DELIVERED' });
    };

    return {
        onMarkDelivered,
    };
};
