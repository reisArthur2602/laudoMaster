import { Headline } from '@/components/headline';
import { TableLoading } from '@/components/table-loading';
import { useParams } from 'react-router';
import { OrgData } from './components/org-data';
import { useOrgData } from './hooks/use-orgs';

export const OrganizationPage = () => {
    const { orgSlug } = useParams();

    const { loading, studies } = useOrgData(orgSlug!);

    return (
        <div className="space-y-6">
            <Headline title="Entrega de Exames" subtitle="Gerenciamento de entrega de exames" />

            {loading ? <TableLoading /> : <OrgData data={studies} />}
        </div>
    );
};
