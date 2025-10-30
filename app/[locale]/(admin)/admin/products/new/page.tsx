// file: app/(admin)/admin/products/new/page.tsx
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

// Import newly added Shadcn/UI components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProductForm } from "../components/ProductForm";

// This is a Server Component that also contains a Server Action.
export default async function AddProductPage() {
  const supportedLocales = ["vi", "en"];
  // Fetch categories to display in the dropdown
  const categories = await prisma.category.findMany({
    include: {
      translations: { where: { locale: "en" } }, // Example locale
    },
  });

  // This Server Action logic remains the same
  async function addProduct(formData: FormData) {
    "use server";

    // ... (Your existing addProduct logic is unchanged)
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const slugs: { [key: string]: string } = {};
    const translationsToUpsert = [];

    // Loop over each language to get its form data
    for (const loc of supportedLocales) {
      const name = formData.get(`name.${loc}`) as string;
      const description = formData.get(`description.${loc}`) as string;

      if (name) {
        const slug = slugify(name, { lower: true, strict: true, locale: loc });
        slugs[loc] = slug;

        translationsToUpsert.push({ locale: loc, name, description, slug });
      }
    }
    
    await prisma.product.create({
      data: {
        translations: { create: translationsToUpsert },
        price,
        stock,
        categoryId,
        images: imageUrl ? [imageUrl] : [],
      },
    });

    revalidatePath("/");
    redirect("/admin/products");
  }

  // The JSX is now refactored with Shadcn/UI components
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Thêm sản phẩm mới</CardTitle>
        <CardDescription>
          Điền thông tin chi tiết cho sản phẩm của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm categories={categories} action={addProduct} />
      </CardContent>
    </Card>
  );
}
