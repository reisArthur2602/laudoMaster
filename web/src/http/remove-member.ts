import { api } from "@/lib/axios";

type Request = {
  inviteId: string;
  slug: string;
};

export const removeMember = async ({ inviteId, slug }: Request) => {
  await api.delete<Response>(`/org/${slug}/members/${inviteId}`);
};
