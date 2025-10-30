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
import { ProductForm } from "../../components/ProductForm";

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
        <ProductForm
          product={product}
          categories={categories}
          action={updateProduct.bind(null, product.id)}
        />
      </CardContent>
    </Card>
  );
}
