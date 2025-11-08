"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Page } from "@/lib/queries/pages";

export const columns: ColumnDef<Page>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Link
          href={`/admin/pages/edit/${product.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
      );
    },
  },
];
