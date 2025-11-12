import { api } from '@/lib/axios';
type Request = {
    studyId: string;
    status: string;
};

export const updateStudyStatus = async ({ studyId, status }: Request) => {
    await api.patch(`/studies/${studyId}/status`, { status });
};
