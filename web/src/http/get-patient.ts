import { api } from "@/lib/axios";


type Request = {
  slug: string;
  patientId: string;
};

export const getPatient = async ({ slug, patientId }: Request) => {
  const { data } = await api.get<Patient>(`/org/${slug}/patients/${patientId}`);
  return data;
};
