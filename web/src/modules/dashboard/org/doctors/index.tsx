import { Headline } from "@/components/headline";
import { useDoctors } from "./hooks/use-doctors";
import { useParams } from "react-router";
import { TableLoading } from "@/components/table-loading";
import { DoctorsData } from "./components/doctors-data";

export const DoctorsPage = () => {
  const { orgSlug } = useParams();

  const { doctors, loading } = useDoctors(orgSlug!);
  return (
    <div className="space-y-6">
      <Headline
        title="Médicos"
        subtitle="Gerencie os médicos da sua organização"
      />
      {loading ? <TableLoading /> : <DoctorsData data={doctors} />}
    </div>
  );
};
