import { api } from "@/lib/axios";

type Request = {
  slug: string;
  name: string;
  modality?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
};

export const createEquipment = async ({ slug, ...data }: Request) => {
  await api.post<Response>(`/org/${slug}/equipments`, data);
};
