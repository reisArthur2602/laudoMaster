import { listOrganizations } from "@/http/list-organizations";
import { useQuery } from "@tanstack/react-query";

export const useOrganizationSwitch = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["orgs"],
    queryFn: listOrganizations,
  });

  return {
    loading: isLoading,
    orgs: data ?? [],
  };
};
