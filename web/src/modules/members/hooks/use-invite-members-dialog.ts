import { createInvite } from "@/http/create-invite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  role: z.enum(["SUPER_ADMIN", "MEMBER"]),
});

type InviteForm = z.infer<typeof schema>;

export const useInviteMembersDialog = (orgSlug: string) => {
  const [open, setOpen] = useState(false);
  const form = useForm<InviteForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", role: "MEMBER" },
  });

  const { mutateAsync: createInviteMutation, isPending } = useMutation({
    mutationFn: createInvite,
    onSuccess: () => {
      toast.success("Convite enviado com sucesso!");
      form.reset();
      setOpen(false);
    },
  });

  const onInviteMember = form.handleSubmit(
    async ({ email, role }: InviteForm) => {
      await createInviteMutation({ email, role, slug: orgSlug! });
    }
  );

  return { open, setOpen, form, onInviteMember, loading: isPending };
};
