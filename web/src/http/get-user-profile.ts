import { api } from "@/lib/axios";

type Response = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const getUserProfile = async () => {
  const { data } = await api.get<Response>("/auth/profile");
  return data;
};
