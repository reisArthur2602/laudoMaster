import { api } from "@/lib/axios";

type Request = {
  slug: string;
  email: string;
  role: Roles;
};

export const createInvite = async ({ slug, email, role }: Request) => {
  await api.post<Response>(`/org/${slug}/invite`, {
    email,
    role,
  });
};
