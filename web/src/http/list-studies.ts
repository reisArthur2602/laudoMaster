import { api } from '@/lib/axios';

type Request = {
    slug: string;
    type?: StudyType;
    status?: StudyStatus;
};

export const listOrgStudies = async ({ slug, type, status }: Request) => {
    const params: Record<string, string | undefined> = {};

    if (type) params.type = type;
    if (status) params.status = status;

    const { data } = await api.get<Study[]>(`/org/${slug}/studies`, { params });

    return data;
};
