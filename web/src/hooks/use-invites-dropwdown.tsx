import { acceptInvite } from "@/http/accept-invite";
import { listInvitesMe } from "@/http/list-invites-me";
import { rejectInvite } from "@/http/reject-invite";
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInvitesDropdown = () => {
  const { data, isPending } = useQuery({
    queryKey: ["invites"],
    queryFn: listInvitesMe,
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: acceptInviteMutation } = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      toast.success("Convite aceito com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });

  const { mutateAsync: rejectInviteMutation } = useMutation({
    mutationFn: rejectInvite,
    onSuccess: () => {
      toast.success("Convite rejeitado.");
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });

  const onAcceptInvite = async (inviteId: string) =>
    await acceptInviteMutation({ inviteId });

  const onRejectInvite = async (inviteId: string) =>
    await rejectInviteMutation({ inviteId });

  return {
    onRejectInvite,
    onAcceptInvite,
    loading: isPending,
    invites: data || [],
  };
};
