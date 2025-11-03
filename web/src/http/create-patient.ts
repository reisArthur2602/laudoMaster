import { api } from "@/lib/axios";

type Request = {
  slug: string;
  name: string;
  cpf: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
};

export const createPatient = async ({ slug, ...data }: Request) => {
  const { data: response } = await api.post(`/org/${slug}/patients`, data);
  return response;
};
