"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useTransition } from "react";
import { deleteManyProducts } from "@/app/actions/product-actions";
import { Button } from "./ui/button";
import { Loader2, Trash } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSelected: (
    ids: string[]
  ) => Promise<{ success: boolean; count?: number; error?: string }>;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  onDeleteSelected,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isPending, startTransition] = useTransition();
  const table = useReactTable({
    data: data || [],
    columns: columns || [],
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const handleDeleteSelected = () => {
    // Get the IDs of the selected products
    const selectedProductIds = table
      .getFilteredSelectedRowModel()
      .rows.filter((row) => row.getIsSelected())
      .map((row) => (row.original as { id: string }).id); // Assumes your data has an 'id'

    if (selectedProductIds.length === 0) return;

    // Show a confirmation dialog
    if (
      !confirm(
        `Are you sure you want to delete ${selectedProductIds.length} product(s)?`
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await onDeleteSelected(selectedProductIds);
      if (result.success) {
        // alert(`Successfully deleted ${result.count} products.`);
        table.resetRowSelection(); // Clear selection
      } else {
        alert(`Error: ${result.error}`);
      }
    });
  };

  const selectedRowCount = Object.keys(rowSelection).length;

  return (
    <div>
      <div className="flex items-center mb-3">
        {selectedRowCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash className="mr-2 h-4 w-4" />
            )}
            Delete ({selectedRowCount})
          </Button>
        )}
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
