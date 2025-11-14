import { Logo } from "@/components/logo";
import { PatientForm } from "./components/patient-form";

export const PatientPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md  p-6 space-y-6">
        <div className="w-fit mx-auto">
          <Logo  />
        </div>

        <div className="space-y-2 text-center">
          <h2>Acesso do paciente</h2>
          <h4 className="text-muted-foreground">
            Use seu CPF e a senha única enviada pela clínica para acessar.
          </h4>
        </div>

        <PatientForm />

        <div className="text-muted-foreground *:[span]:hover:text-primary text-center text-xs text-balance *:[span]:underline *:[span]:underline-offset-4 *:[span]:hover:cursor-pointer">
          Ao continuar, você concorda com nossos{" "}
          <span className="hover:underline">Termos de Serviço</span> e{" "}
          <span className="hover:underline">Política de Privacidade</span>.
        </div>
      </div>
    </div>
  );
};
