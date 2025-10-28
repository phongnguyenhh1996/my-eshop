"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@/navigation";
import { ProductRowType } from "@/lib/queries/products";

export const columns: ColumnDef<ProductRowType>[] = [
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
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Link href={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:underline">
            Edit
          </Link>
        )
      }
    }
  ];