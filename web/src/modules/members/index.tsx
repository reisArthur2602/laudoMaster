import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { InviteMemberDialog } from "./components/invite-members-dialog";

import { useMembers } from "./hooks/use-members";
import { MembersData } from "./components/members-data";
import { useParams } from "react-router";
import { TableLoading } from "@/components/table-loading";
import { Headline } from "@/components/headline";

export const MembersPage = () => {
  const { orgSlug } = useParams();

  const { members, loading } = useMembers(orgSlug!);

  return (
    <div className="space-y-6">
      <Headline
        title="Membros"
        subtitle=" Gerencie os memebros da sua organização."
        children={<InviteMemberDialog />}
      />

      {loading ? <TableLoading /> : <MembersData data={members} />}
    </div>
  );
};
