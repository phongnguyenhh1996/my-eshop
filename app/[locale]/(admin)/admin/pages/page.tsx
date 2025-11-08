import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { columns } from "./columns";
import { deleteManyProducts } from "@/app/actions/product-actions";
import { getPagesForAdmin } from "@/lib/queries/pages";

// This is a Server Component that also contains a Server Action.
export default async function ListPage() {
  // Fetch products with translations and category data
  const pages = await getPagesForAdmin()

  // The JSX is now refactored with Shadcn/UI components
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        Pages
        <Button className="ml-4">
          <Link className="flex" href="/admin/pages/new"><IconPlus className="mr-2" /> Add New Page</Link>
        </Button>
      </h1>
      <DataTable columns={columns} data={pages || []} onDeleteSelected={deleteManyProducts}/>
    </div>
  );
}
