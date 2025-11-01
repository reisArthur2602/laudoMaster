import { api } from "@/lib/axios";

type Request = {
  inviteId: string;
};

export const rejectInvite = async ({ inviteId }: Request) => {
  await api.post<Response>(`/invites/${inviteId}/reject`);
};
