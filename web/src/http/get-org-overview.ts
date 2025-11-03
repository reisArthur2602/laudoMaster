import { api } from "@/lib/axios";
type Request = {
  slug: string;
};

export const getOrgOverview = async ({ slug }: Request) => {
  const { data } = await api.get<OrganizationOverview>(
    `/org/${slug}/overview`
  );
  return data;
};
