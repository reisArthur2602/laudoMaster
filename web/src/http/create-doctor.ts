import { api } from "@/lib/axios";

type Request = {
  slug: string;
};

export const createDoctor = async ({ slug }: Request) => {
  await api.post(`/org/${slug}/doctors`); 
};


