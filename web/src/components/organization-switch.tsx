import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrganizationSwitch } from "@/hooks/use-organization-switch";

import { ChevronsUpDown } from "lucide-react";
import { Link, useParams } from "react-router";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { formatRole } from "@/utils/format-role";
import { CreateOrganizationDialog } from "./create-organization-dialog";

export const OrganizationSwitch = () => {
  const { loading, orgs } = useOrganizationSwitch();

  const { orgSlug: currentOrgSlug } = useParams();

  const currentOrganization =
    orgs?.find((o) => o.slug === currentOrgSlug) ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-[220px] flex items-center gap-2 text-sm font-medium outline-none  p-1">
        {loading ? (
          <Skeleton className="h-5 w-[220px]" />
        ) : currentOrganization ? (
          <span className="text-sm truncate text-left capitalize">
            {currentOrganization.name}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground truncate text-left">
            Selecionar Organização
          </span>
        )}
        <ChevronsUpDown className="ml-auto size-3 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center">
        <DropdownMenuLabel>Organizações</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {orgs?.length ? (
          orgs.map((org) => (
            <DropdownMenuItem
              key={org.id}
              className="truncate data-[current=true]:bg-muted"
              asChild
              data-current={org.slug === currentOrgSlug}
            >
              <Link
                to={`/dashboard/${org.slug}`}
                className="flex items-center gap-2 justify-between"
              >
                <span className="truncate capitalize">{org.name}</span>
                <Badge variant="secondary">{formatRole(org.role)}</Badge>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-2 text-sm text-muted-foreground">
            Nenhuma organização encontrada
          </div>
        )}

        <DropdownMenuSeparator />
        <CreateOrganizationDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitch;
