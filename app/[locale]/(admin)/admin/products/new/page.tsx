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

// This is a Server Component that also contains a Server Action.
export default async function AddProductPage() {
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
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;

    if (!name || !price || !stock || !categoryId) {
      return; // Or handle error
    }

    const slug = slugify(name, { lower: true, strict: true, locale: "vi" });

    await prisma.product.create({
      data: {
        translations: {
          create: [{ locale: "en", name, description, slug }]
        },
        price,
        stock,
        categoryId,
        images: []
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
        <form action={addProduct} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ví dụ: Áo Thun Cotton"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Ví dụ: 250000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                placeholder="Ví dụ: 100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Danh mục</Label>
            {/* The Select component has a more complex structure */}
            <Select name="categoryId" required>
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Chọn một danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.translations[0]?.name || "Unnamed Category"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Thêm sản phẩm
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
