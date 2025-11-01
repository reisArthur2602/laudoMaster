import { api } from "@/lib/axios";

type Request = {
  email: string;
  password: string;
};
type Response = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export const login = async ({ email, password }: Request) => {
  const { data } = await api.post<Response>("/auth/login", { email, password });
  return data;
};
