"use client";

import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Prisma } from "@prisma/client";
import { useTranslations } from "next-intl";

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

export function ProductForm({
  product,
  action,
  categories,
}: {
  product?: Prisma.ProductGetPayload<{ include: { translations: true } }>;
  action: (formData: FormData, productId?: string) => Promise<void>;
  categories: Prisma.CategoryGetPayload<{ include: { translations: true } }>[];
}) {
  const t = useTranslations("admin");
  return (
    <form action={action} className="space-y-6">
      {/* Non-translatable fields stay outside the tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="price">Image</Label>
          <ImageUploader
            name="imageUrl"
            defaultValue={
              Array.isArray(product?.images) ? product.images[0] : undefined
            } // Pass the first image as default if images is an array
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            required
            defaultValue={
              typeof product?.price === "number" ? product.price : undefined
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            required
            defaultValue={
              typeof product?.stock === "number" ? product.stock : undefined
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select
          name="categoryId"
          required
          defaultValue={product?.categoryId}
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
      <Tabs defaultValue={"vi"} className="w-full">
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
                  Array.isArray(product?.translations)
                    ? getTranslation(product.translations, loc).name
                    : ""
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
                  Array.isArray(product?.translations)
                    ? getTranslation(product.translations, loc).description || ""
                    : ""
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`slug.${loc}`}>Slug ({loc.toUpperCase()})</Label>
              <Input
                id={`slug.${loc}`}
                name={`slug.${loc}`}
                defaultValue={Array.isArray(product?.translations) ? getTranslation(product.translations, loc).slug : ""}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Button type="submit" className="w-full">
        {t("save_changes")}
      </Button>
    </form>
  );
}
