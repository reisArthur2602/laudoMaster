import { api } from "@/lib/axios";

export const getUserProfile = async () => {
  const { data } = await api.get<User>("/auth/profile");
  return data;
};
