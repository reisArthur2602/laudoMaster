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
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { MarkAsDeliveredDialog } from './mark-as-delivered-dialog';

const orgColumns: ColumnDef<Study>[] = [
    {
        accessorKey: 'patient.name',
        header: () => 'Paciente',
        cell: ({ row }) => (
            <div className="font-medium text-foreground capitalize">
                {row.original.patient?.name?.toLocaleLowerCase()}
            </div>
        ),
    },
    {
        accessorKey: 'doctor.name',
        header: () => 'Responsável',
        cell: ({ row }) => (
            <div className="font-medium text-foreground capitalize">
                {row.original.doctor?.name?.toLocaleLowerCase()}
            </div>
        ),
    },

    {
        accessorKey: 'description',
        header: () => 'Exame',
        cell: ({ row }) => (
            <span className="capitalize truncate">{row.original.description?.toLowerCase()}</span>
        ),
    },
    {
        accessorKey: 'createdAt',
        header: () => 'Realizado em',
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return <span>{date.toLocaleDateString('pt-BR')}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => <MarkAsDeliveredDialog id={row.original.id} />,
    },
];

type StudiesData = {
    data: Study[];
};

export const OrgData = ({ data }: StudiesData) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns: orgColumns,
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        initialState: { pagination: { pageSize: 8 } },
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
                                    colSpan={table.getAllColumns().length}
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
