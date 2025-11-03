import { api } from "@/lib/axios";

type Request = {
  slug: string;
};

export const listOrgStudies = async ({ slug }: Request) => {
  const { data } = await api.get<Study[]>(`/org/${slug}/studies`);
  return data;
};
