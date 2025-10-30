"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@/navigation";
import { ProductRowType } from "@/lib/queries/products";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<ProductRowType>[] = [
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
    accessorKey: "translations.0.name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Link
          href={`/admin/products/edit/${product.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
      );
    },
  },
];
