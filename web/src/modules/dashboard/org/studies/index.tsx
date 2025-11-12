import { useParams } from "react-router";

import { useStudies } from "./hooks/use-studies";

import { TableLoading } from "@/components/table-loading";
import { StudiesData } from "./components/studies-data";
import { Headline } from "@/components/headline";
import { CreateStudyDialog } from "./components/create-study-dialog";
import { usePermission } from "@/hooks/use-permission";

export const StudiesPage = () => {
  const { orgSlug } = useParams();
  const { role, hasPermission } = usePermission(orgSlug!);
  const { loading, studies } = useStudies(orgSlug!);

  const allowed = hasPermission(["ADMIN", "TECHNICAL"]);

  return (
    <div className="space-y-6">
      <Headline
        title="Exames"
        subtitle="Listagem dos pacientes e seus históricos de exames."
        children={allowed && <CreateStudyDialog />}
      />

      {loading ? <TableLoading /> : <StudiesData data={studies} role={role} />}
    </div>
  );
};
