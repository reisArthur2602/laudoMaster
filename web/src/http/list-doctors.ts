import { api } from "@/lib/axios";

type Request = {
  slug: string;
};

export const listDoctors = async ({ slug }: Request) => {
  const { data } = await api.get<Doctor[]>(`/org/${slug}/doctors`);
  return data;
};


