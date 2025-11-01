import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { login } from "@/http/login";
import z from "zod";
import Cookies from "js-cookie";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginForm = z.infer<typeof schema>;

export const useLoginForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const isDev = import.meta.env.VITE_NODE_ENV === "development";

      Cookies.set("laudoMaster_token", response.token, {
        expires: 7,
        secure: !isDev,
        sameSite: isDev ? "Lax" : "Strict",
        path: "/",
      });

      navigate("/dashboard", { replace: true });
    },
  });

  const onLogin = form.handleSubmit(
    async (data: LoginForm) => await loginMutation(data)
  );

  return { form, onLogin };
};
