import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrganizationSwitch } from '@/hooks/use-organization-switch';

import { formatRole } from '@/utils/format-role';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { CreateOrganizationDialog } from './create-organization-dialog';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

export const OrganizationSwitch = () => {
    const navigate = useNavigate();
    const { loading, orgs } = useOrganizationSwitch();

    const { orgSlug: currentOrgSlug } = useParams();


    useEffect(() => {
        if (!loading && orgs?.length && !currentOrgSlug) {
            navigate(`/dashboard/${orgs[0].slug}`, { replace: true });
        }
    }, [loading, orgs, currentOrgSlug, navigate]);

    const currentOrganization = orgs?.find((o) => o.slug === currentOrgSlug) ?? null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-[220px] flex items-center gap-2 text-sm font-medium outline-none p-1">
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
                                className="flex items-center justify-between gap-2"
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
