"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Element } from "@/lib/queries/elements";

export const columns: ColumnDef<Element>[] = [
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
    accessorKey: "identifier",
    header: "Identifier",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Link
          href={`/admin/elements/edit/${product.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
      );
    },
  },
];
