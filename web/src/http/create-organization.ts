import { api } from "@/lib/axios";

type Request = {
  name: string;
};

export const createOrganization = async ({ name }: Request) => {
  await api.post<Response>(`/org`, {
    name,
  });
};
