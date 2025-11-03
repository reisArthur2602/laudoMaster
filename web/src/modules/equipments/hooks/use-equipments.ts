import { listEquipments } from "@/http/list-equipments";

import { useQuery } from "@tanstack/react-query";

export const useEquipments = (orgSlug: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["equipments", orgSlug],
    queryFn: () => listEquipments({ slug: orgSlug! }),
  });

  return { equipments: data || [], loading: isPending };
};
