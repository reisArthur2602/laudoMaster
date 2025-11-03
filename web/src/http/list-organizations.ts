import { api } from "@/lib/axios";

export const listOrganizations = async () => {
  const { data } = await api.get<Organization[]>("/org");
  return data;
};
