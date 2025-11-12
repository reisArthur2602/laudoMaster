import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod/v3";

const schema = z.object({
  cpf: z
    .string()
    .min(14, "Informe um CPF válido.")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido."),
  patientId: z.string().min(3, "Informe a senha de acesso."),
});

export const usePatientForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { cpf: "", patientId: "" },
  });

  return {
    form,
    loading: form.formState.isSubmitting,
  };
};
