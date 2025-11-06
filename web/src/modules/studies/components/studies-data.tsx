import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  MoreHorizontal,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { formatStudyStatus } from "@/utils/format-study-status";
import { StudyAttachments } from "./study-attachments";

const studyColumns: ColumnDef<Study>[] = [
  {
    accessorKey: "patient.name",
    header: () => "Paciente",
    cell: ({ row }) => (
      <div className="font-medium text-foreground capitalize">
        {row.original.patient?.name.toLocaleLowerCase()}
      </div>
    ),
  },
  {
    accessorKey: "doctor.name",
    header: () => "Responsável",
    cell: ({ row }) => (
      <div className="font-medium text-foreground capitalize">
        {row.original.doctor?.name.toLocaleLowerCase()}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const getBadgeVariant = (status: StudyStatus) => {
        switch (status) {
          case "PENDING":
            return "secondary";
          case "DELIVERED":
            return "default";
          default:
            return "outline";
        }
      };

      return (
        <Badge variant={getBadgeVariant(status)}>
          {formatStudyStatus(status)}
        </Badge>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: () => "Realizado em",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span>{date.toLocaleDateString("pt-BR")}</span>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-end">
            <span className="sr-only">Abrir Menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <StudyAttachments study={row.original} />
          <DropdownMenuItem asChild>
            <a
              href={`http://10.1.1.145:5000/viewer_pro.html?study=${row.original.studyId}`}
            >
              <ImageIcon />
              Ver Imagens
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

type StudiesData = {
  data: Study[];
};

export const StudiesData = ({ data }: StudiesData) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns: studyColumns,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    initialState: { pagination: { pageSize: 6 } },
    state: { sorting, columnFilters },
  });

  return (
    <>
      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-4">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="text-muted-foreground text-sm">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={studyColumns.length}
                  className="h-24 text-center"
                >
                  Nenhum exame encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-2 mt-4 justify-end">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
      </div>
    </>
  );
};
