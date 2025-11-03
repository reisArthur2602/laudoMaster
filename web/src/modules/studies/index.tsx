import { useParams } from "react-router";

import { useStudies } from "./hooks/use-studies";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { TableLoading } from "@/components/table-loading";
import { StudiesData } from "./components/studies-data";
import { Headline } from "@/components/headline";

const mockApiStudies = [
  {
    id: "st1",
    modality: "CR",
    status: "PENDING",
    createdAt: new Date("2025-10-28T10:30:00Z"),
    patient: { name: "Maria da Silva" },
    attachments: [
      {
        id: "att1",
        filename: "laudo_torax.pdf",
        url: "https://example.com/laudos/laudo_torax.pdf",
        size: 154_321,
      },
    ],
  },
  {
    id: "st2",
    modality: "US",
    status: "REPORTING",
    createdAt: new Date("2025-10-27T15:45:00Z"),
    patient: { name: "João Pereira" },
    attachments: [
      {
        id: "att2",
        filename: "us_abdomen_total.pdf",
        url: "https://example.com/laudos/us_abdomen_total.pdf",
        size: 203_452,
      },
      {
        id: "att3",
        filename: "imagens_abdomen.zip",
        url: "https://example.com/imagens/imagens_abdomen.zip",
        size: 1_024_000,
      },
    ],
  },
  {
    id: "st3",
    modality: "CT",
    status: "REPORTED",
    createdAt: new Date("2025-10-25T09:15:00Z"),
    patient: { name: "Ana Souza" },
    attachments: [],
  },
  {
    id: "st4",
    modality: "MR",
    status: "DELIVERED",
    createdAt: new Date("2025-10-23T14:00:00Z"),
    patient: { name: "Carlos Lima" },
    attachments: [
      {
        id: "att4",
        filename: "resonancia_cranio.pdf",
        url: "https://example.com/laudos/resonancia_cranio.pdf",
        size: 298_000,
      },
    ],
  },
  {
    id: "st5",
    modality: "MG",
    status: "PENDING",
    createdAt: new Date("2025-10-29T08:20:00Z"),
    patient: { name: "Luciana Torres" },
    attachments: [],
  },
];

export const StudiesPage = () => {
  const { orgSlug } = useParams();

  const { loading, studies } = useStudies(orgSlug!);

  return (
    <div className="space-y-6">
      <Headline
        title="Exames"
        subtitle="Listagem dos pacientes e seus históricos de exames."
      />

      {loading ? (
        <TableLoading />
      ) : (
        <StudiesData data={mockApiStudies as unknown as Study[]} />
      )}
    </div>
  );
};
