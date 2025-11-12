import { EquipmentDialog } from "./components/equipments-dialog";
import { TableLoading } from "@/components/table-loading";
import { EquipmentsData } from "./components/equipments-data";
import { useEquipments } from "./hooks/use-equipments";
import { useParams } from "react-router";
import { Headline } from "@/components/headline";

export const EquipmentsPage = () => {
  const { orgSlug } = useParams();

  const { equipments, loading } = useEquipments(orgSlug!);
  return (
    <div className="space-y-6">
      <Headline
        title="Equipamentos"
        subtitle=" Gerencie os equipamentos associados à organização"
        children={<EquipmentDialog />}
      />

      {loading ? <TableLoading /> : <EquipmentsData data={equipments} />}
    </div>
  );
};
