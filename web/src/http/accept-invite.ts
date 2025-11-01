import { api } from "@/lib/axios";

type Request = {
  inviteId: string;
};

export const acceptInvite = async ({ inviteId }: Request) => {
  await api.post<Response>(`/invites/${inviteId}/accept`);
};
