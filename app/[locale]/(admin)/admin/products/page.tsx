import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { columns } from "./columns";
import { getProductsForAdmin } from "@/lib/queries/products";
import { deleteManyProducts, syncProductsFromExcel } from "@/app/actions/product-actions";
import { ProductImporter } from "@/components/product-importer";

// This is a Server Component that also contains a Server Action.
export default async function AddProductPage() {
  // Fetch products with translations and category data
  const products = await getProductsForAdmin("en")

  // The JSX is now refactored with Shadcn/UI components
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        Products
        <Button className="ml-4">
          <Link className="flex" href="/admin/products/new"><IconPlus className="mr-2" /> Add New Product</Link>
        </Button>
      </h1>
      <div className="mb-6">
        <ProductImporter onLoadedProducts={syncProductsFromExcel} />
      </div>
      <DataTable columns={columns} data={products || []} onDeleteSelected={deleteManyProducts}/>
    </div>
  );
}
