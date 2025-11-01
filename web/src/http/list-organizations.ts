import { api } from "@/lib/axios";

export const listInvitesMe = async () => {
  const { data } = await api.get<Invite[]>("/invites/me");
  return data;
};
