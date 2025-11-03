import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import z from "zod";

import { createOrganization } from "@/http/create-organization";
import { toast } from "sonner";
import { useState } from "react";
import { queryClient } from "@/main";

const schema = z.object({
  name: z.string(),
});

type CreateOrganizationForm = z.infer<typeof schema>;

export const useCreateOrganization = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const { mutateAsync: createOrganizationMutation } = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      toast.success("Organização criada com sucesso!");
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
      navigate("/dashboard", { replace: true });
    },
  });

  const onCreateOrganization = form.handleSubmit(
    async (data: CreateOrganizationForm) =>
      await createOrganizationMutation(data)
  );

  return { form, onCreateOrganization, open, setOpen };
};
