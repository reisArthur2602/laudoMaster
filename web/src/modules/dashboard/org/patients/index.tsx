import { Headline } from '@/components/headline';
import { TableLoading } from '@/components/table-loading';
import { usePermission } from '@/hooks/use-permission';
import { useParams } from 'react-router';
import { PatientDialog } from './components/patient-dialog';
import { PatientsData } from './components/patients-data';
import { usePatients } from './hooks/use-patients';

export const PatientsPage = () => {
    const { orgSlug } = useParams();
    const { loading, patients } = usePatients(orgSlug!);

    const { hasPermission } = usePermission(orgSlug!);
    const allowed = hasPermission(['ADMIN', 'TECHNICAL']);

    return (
        <div className="space-y-6">
            <Headline
                title="Pacientes"
                subtitle="Listagem dos pacientes e seus históricos de exames."
                children={allowed && <PatientDialog />}
            />

            {loading ? <TableLoading /> : <PatientsData data={patients} />}
        </div>
    );
};
