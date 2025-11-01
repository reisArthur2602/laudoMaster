import { api } from "@/lib/axios";

type Request = {
  slug: string;
};

export const deleteOrganization = async ({ slug }: Request) => {
  await api.delete<Response>(`/org/${slug}`);
};
