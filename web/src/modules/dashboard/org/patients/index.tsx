import { PatientDialog } from "./components/patient-dialog";
import { TableLoading } from "@/components/table-loading";
import { PatientsData } from "./components/patients-data";
import { usePatients } from "./hooks/use-patients";
import { useParams } from "react-router";
import { Headline } from "@/components/headline";

export const PatientsPage = () => {
  const { orgSlug } = useParams();
  const { loading, patients } = usePatients(orgSlug!);
  return (
    <div className="space-y-6">
      <Headline
        title="Pacientes"
        subtitle="Listagem dos pacientes e seus históricos de exames."
        children={<PatientDialog />}
      />

      {loading ? <TableLoading /> : <PatientsData data={patients} />}
    </div>
  );
};
