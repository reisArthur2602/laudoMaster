import { api } from "@/lib/axios";

type Request = {
  slug: string;
  type?: StudyType;
};

export const listOrgStudies = async ({ slug, type }: Request) => {
  const { data } = await api.get<Study[]>(`/org/${slug}/studies`, {
    params: type ? { type } : {},
  });
  return data;
};
