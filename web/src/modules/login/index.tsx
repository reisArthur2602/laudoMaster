import { Logo } from "@/components/logo";
import { LoginForm } from "./components/login-form";

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 md:px-0 ">
      <div className="mx-auto max-w-sm grid w-full">
        <div className="flex flex-col gap-6">
          <div className="w-fit mx-auto">
            <Logo to="/" />
          </div>
          <div>
            <h2>Acesso à plataforma Master</h2>
            <h4 className="text-muted-foreground">
              Entre na sua conta e retome de onde parou
            </h4>
          </div>

          <LoginForm />

          <div className="text-muted-foreground *:[span]:hover:text-primary text-center text-xs text-balance *:[span]:underline *:[span]:underline-offset-4 *:[span]:hover:cursor-pointer">
            Ao continuar, você concorda com nossos{" "}
            <span className="hover:underline">Termos de Serviço</span> e{" "}
            <span className="hover:underline">Política de Privacidade</span>.
          </div>
        </div>
      </div>
    </div>
  );
};
