import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

import { listOrgPatients } from "@/http/list-org-patients";
import { createStudy } from "@/http/create-study";

const schema = z.object({
  patientId: z.string().min(1, "Selecione um paciente."),
  description: z.string().min(3, "A descrição é obrigatória."),
  file: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "Envie um PDF válido."),
});

export type StudyFormData = z.infer<typeof schema>;

export const useCreateStudyDialog = (orgSlug: string) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: patients = [],
    isPending: loadingPatients,
    error,
  } = useQuery({
    queryKey: ["patients", orgSlug],
    queryFn: () => listOrgPatients({ slug: orgSlug }),
    enabled: open,
  });

  if (error) {
    toast.error("Erro ao carregar pacientes");
  }

  const form = useForm<StudyFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: "",
      description: "",

      file: undefined,
    },
  });

  const { mutateAsync: createStudyMutation, isPending } = useMutation({
    mutationFn: createStudy,
    onSuccess: () => {
      toast.success("Exame criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["studies", orgSlug] });
      form.reset();
      setOpen(false);
    },
  });

  const onCreateStudy = form.handleSubmit(async (data) => {
    await createStudyMutation({
      slug: orgSlug,
      patientId: data.patientId,
      description: data.description,
      file: data.file,
    });
  });

  return {
    open,
    setOpen,
    form,
    onCreateStudy,
    patients,
    loading: isPending || loadingPatients,
  };
};
