import { useParams } from "react-router";

import { useStudies } from "./hooks/use-studies";

import { TableLoading } from "@/components/table-loading";
import { StudiesData } from "./components/studies-data";
import { Headline } from "@/components/headline";

export const StudiesPage = () => {
  const { orgSlug } = useParams();

  const { loading, studies } = useStudies(orgSlug!);

  return (
    <div className="space-y-6">
      
      <Headline
        title="Exames"
        subtitle="Listagem dos pacientes e seus históricos de exames."
      />

      {loading ? <TableLoading /> : <StudiesData data={studies} />}
    </div>
  );
};
