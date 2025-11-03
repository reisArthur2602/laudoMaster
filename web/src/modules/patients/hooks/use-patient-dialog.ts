import { createPatient } from "@/http/create-patient";
import { queryClient } from "@/main";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// 🧩 Validação Zod
const schema = z.object({
  name: z.string().min(3, "O nome é obrigatório."),
  cpf: z
    .string()
    .min(11, "CPF deve conter 11 dígitos numéricos")
    .max(14, "CPF inválido")
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/\D/g, "").length >= 10, {
      message: "Telefone inválido",
    }),
  birthDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val),
      "Data deve estar no formato DD/MM/AAAA"
    ),
  gender: z.enum(["M", "F", "O"]).optional(),
});

export type PatientFormData = z.infer<typeof schema>;

export const usePatientDialog = (orgSlug: string) => {
  const [open, setOpen] = useState(false);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      birthDate: "",
      gender: undefined,
    },
  });

  const cleanPatientData = (data: PatientFormData) => {
    const cleanCpf = data.cpf.replace(/\D/g, "");
    const cleanPhone = data.phone ? data.phone.replace(/\D/g, "") : undefined;

    let isoBirthDate: string | undefined;
    if (data.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(data.birthDate)) {
      const [day, month, year] = data.birthDate.split("/");
      isoBirthDate = new Date(`${year}-${month}-${day}`).toISOString();
    }

    return {
      ...data,
      cpf: cleanCpf,
      phone: cleanPhone,
      birthDate: isoBirthDate,
      slug: orgSlug,
    };
  };

  const { mutateAsync: createPatientMutation, isPending } = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      toast.success("Paciente cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["patients", orgSlug] });
      form.reset();
      setOpen(false);
    },
  });

  const onCreatePatient = form.handleSubmit(async (data) => {
    const payload = cleanPatientData(data);
    await createPatientMutation(payload);
  });

  return { open, setOpen, form, onCreatePatient, loading: isPending };
};
