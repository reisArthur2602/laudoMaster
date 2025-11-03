import { api } from "@/lib/axios";

type Request = {
  slug: string;
};

type PatientListItem = Pick<Patient, "id" | "name" | "cpf" | "createdAt">;

export const listOrgPatients = async ({ slug }: Request) => {
  const { data } = await api.get<PatientListItem[]>(`/org/${slug}/patients`);
  return data;
};
