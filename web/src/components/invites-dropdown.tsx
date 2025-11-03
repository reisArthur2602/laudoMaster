import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Mail, X } from "lucide-react";
import { useInvitesDropdown } from "@/hooks/use-invites-dropwdown";
import { formatRole } from "@/utils/format-role";

export const InvitesDropdown = () => {
  const { invites, loading, onAcceptInvite, onRejectInvite } =
    useInvitesDropdown();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="outline-none">
        <Button
          variant="ghost"
          size="icon"
          className="relative outline-none"
          title="Convites recebidos"
        >
          <Mail className="size-4" />
          {invites.length > 0 && (
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[320px]">
        <DropdownMenuLabel>Convites Recebidos</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading && (
          <div className="p-2 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        )}

        {!loading && invites.length === 0 && (
          <div className="p-4 text-xs text-muted-foreground">
            Nenhum convite recebido.
          </div>
        )}

        {invites.map((invite) => (
          <DropdownMenuItem
            key={invite.id}
            className="flex flex-col items-start gap-2 py-2 px-3"
          >
            <div className="flex flex-col w-full">
              <p className="text-sm font-medium">{invite.organization.name}</p>
              <p className="text-xs text-muted-foreground">
                Convite como{" "}
                <span className="font-semibold">{formatRole(invite.role)}</span>
              </p>
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => onRejectInvite(invite.id)}
                >
                  <X className="h-3 w-3 mr-1" /> Recusar
                </Button>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => onAcceptInvite(invite.id)}
                >
                  <Check className="h-3 w-3 mr-1 dark:invert" /> Aceitar
                </Button>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
