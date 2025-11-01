import { api } from "@/lib/axios";

type Request = {
  slug: string;
};

export const getMyMembership = async ({ slug }: Request) => {
  const { data } = await api.get<{ role: Roles }>(`/org/${slug}/members/me`);
  return data;
};
