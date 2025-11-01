import { api } from "@/lib/axios";

type Request = {
  slug: string;
};

export const listMembers = async ({ slug }: Request) => {
  const { data } = await api.get<Member[]>(`/org/${slug}/members`);
  return data;
};
