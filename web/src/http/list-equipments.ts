import { api } from "@/lib/axios";

type Request = {
  slug: string;
};

export const listEquipments = async ({ slug }: Request) => {
  const { data } = await api.get<Equipment[]>(`/org/${slug}/equipments`);
  return data;
};
