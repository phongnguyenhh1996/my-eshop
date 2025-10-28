import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

// 1. Import Tabs components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ImageUploader } from "@/components/image-uploader";

// Helper function to find a specific translation
function getTranslation(
  translations: {
    locale: string;
    name: string;
    description: string | null;
    slug: string;
  }[],
  locale: string
) {
  return (
    translations.find((t) => t.locale === locale) || {
      name: "",
      description: "",
      slug: "",
    }
  );
}

export default async function EditProductPage({
  params,
}: {
  params: { productId: string; locale: string };
}) {
  const { productId, locale } = params;
  const t = await getTranslations("admin");
  const supportedLocales = ["vi", "en"]; // Define your supported languages

  // 2. Fetch the product WITH ALL translations
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      translations: true, // Get all translations
    },
  });

  const categories = await prisma.category.findMany({
    include: {
      translations: { where: { locale } }, // For the dropdown
    },
  });

  if (!product) {
    notFound();
  }

  // 3. This Server Action now updates ALL languages
  async function updateProduct(productId: string, formData: FormData) {
    "use server";

    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const translationsToUpsert = [];
    const slugs: { [key: string]: string } = {};

    // Loop over each language to get its form data
    for (const loc of supportedLocales) {
      const name = formData.get(`name.${loc}`) as string;
      const description = formData.get(`description.${loc}`) as string;

      if (name) {
        const slug = slugify(name, { lower: true, strict: true, locale: loc });
        slugs[loc] = slug;

        translationsToUpsert.push({
          where: { productId_locale: { productId, locale: loc } },
          update: { name, description, slug },
          create: { locale: loc, name, description, slug },
        });
      }
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        price,
        stock,
        categoryId,
        images: imageUrl ? [imageUrl] : [],
        translations: {
          upsert: translationsToUpsert, // Upsert all translations at once
        },
      },
    });

    // Revalidate all necessary paths
    revalidatePath("/admin/products");
    revalidatePath("/");
    if (slugs.vi) revalidatePath(`/san-pham/${slugs.vi}`);
    if (slugs.en) revalidatePath(`/san-pham/${slugs.en}`);

    redirect("/admin/products");
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t("edit_product")}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 4. Bind ONLY the productId to the action */}
        <form
          action={updateProduct.bind(null, product.id)}
          className="space-y-6"
        >
          {/* Non-translatable fields stay outside the tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="price">Image</Label>
              <ImageUploader
                name="imageUrl"
                defaultValue={product.images[0]} // Pass the first image as default
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                required
                defaultValue={product.price}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                required
                defaultValue={product.stock}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              name="categoryId"
              required
              defaultValue={product.categoryId}
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Select a category" />
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

          {/* 4. Use Tabs for translatable fields */}
          <Tabs defaultValue={locale} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vi">Tiếng Việt (VI)</TabsTrigger>
              <TabsTrigger value="en">English (EN)</TabsTrigger>
            </TabsList>
            {["vi", "en"].map((loc) => (
              <TabsContent key={loc} value={loc} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor={`name.${loc}`}>
                    Product Name ({loc.toUpperCase()})
                  </Label>
                  <Input
                    id={`name.${loc}`}
                    name={`name.${loc}`}
                    defaultValue={
                      getTranslation(product.translations, loc).name
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description.${loc}`}>
                    Description ({loc.toUpperCase()})
                  </Label>
                  <Textarea
                    id={`description.${loc}`}
                    name={`description.${loc}`}
                    defaultValue={
                      getTranslation(product.translations, loc).description ||
                      ""
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`slug.${loc}`}>
                    Slug ({loc.toUpperCase()})
                  </Label>
                  <Input
                    id={`slug.${loc}`}
                    name={`slug.${loc}`}
                    defaultValue={
                      getTranslation(product.translations, loc).slug
                    }
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <Button type="submit" className="w-full">
            {t("save_changes")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
