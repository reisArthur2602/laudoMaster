import { Headline } from '@/components/headline';
import { TableLoading } from '@/components/table-loading';
import { Card } from '@/components/ui/card';
import { CheckCircle2, FileText } from 'lucide-react';
import { useParams } from 'react-router';
import { OrgData } from './components/org-data';
import { useOrgData } from './hooks/use-orgs';

export const OrganizationPage = () => {
    const { orgSlug } = useParams();
    const exams = [
        {
            id: 1,
            patientName: 'João Silva',
            patientCPF: '123.456.789-00',
            examName: 'Hemograma Completo',
            examDate: '15/03/2024',
            status: 'pending',
        },
        {
            id: 2,
            patientName: 'Maria Santos',
            patientCPF: '987.654.321-00',
            examName: 'Glicemia de Jejum',
            examDate: '15/03/2024',
            status: 'pending',
        },
        {
            id: 3,
            patientName: 'Pedro Oliveira',
            patientCPF: '456.789.123-00',
            examName: 'Colesterol Total',
            examDate: '14/03/2024',
            status: 'pending',
        },
        {
            id: 4,
            patientName: 'Ana Costa',
            patientCPF: '789.123.456-00',
            examName: 'Hemograma Completo',
            examDate: '10/03/2024',
            status: 'delivered',
        },
    ];

    const { loading, studies } = useOrgData(orgSlug!);

    return (
        <div className="space-y-6">
            <Headline title="Entrega de Exames" subtitle="Gerenciamento de entrega de exames" />

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Aguardando Retirada
                            </p>
                            <p className="text-3xl font-bold text-foreground">{exams.length}</p>
                        </div>
                        <div className="size-12 rounded-xl bg-warning/10 flex items-center justify-center">
                            <FileText className="size-6 text-warning" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Entregues</p>
                            <p className="text-3xl font-bold text-foreground">{exams.length}</p>
                        </div>
                        <div className="size-12 rounded-xl  flex items-center justify-center">
                            <CheckCircle2 className="size-6" />
                        </div>
                    </div>
                </Card>
            </div>

            {loading ? <TableLoading /> : <OrgData data={studies} />}
        </div>
    );
};
