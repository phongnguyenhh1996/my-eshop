"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

const supportedLocales = ["vi", "en"]; // Define supported languages

/**
 * Creates a new product using a type-safe input object.
 */
export async function createProduct(input: Prisma.ProductCreateInput) {
  try {
    const newProduct = await prisma.product.create({
      data: input,
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/san-pham", "layout"); // Revalidate layout for slugs

    return { success: true, data: newProduct };
  } catch (error: unknown) {
    console.error("Failed to create product:", error);
    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as { code?: string }).code === 'P2002') {
        return { success: false, error: "A product with this slug or SKU already exists." };
      }
    }
    return { success: false, error: "Failed to create product." };
  }
}

/**
 * Updates an existing product using FormData.
 */
export async function updateProduct(productId: string, formData: FormData) {
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;

  const translationsToUpsert = [];
  const slugs: { [key: string]: string } = {};

  for (const loc of supportedLocales) {
    const name = formData.get(`name.${loc}`) as string;
    const description = formData.get(`description.${loc}`) as string;

    if (name) { // Only process if name is provided
      const slug = slugify(name, { lower: true, strict: true, locale: loc });
      slugs[loc] = slug;

      translationsToUpsert.push({
        where: { productId_locale: { productId, locale: loc } },
        update: { name, description, slug },
        create: { locale: loc, name, description, slug },
      });
    }
  }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        price,
        stock,
        categoryId,
        translations: {
          upsert: translationsToUpsert,
        },
        // TODO: Handle image update
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    // Revalidate specific product pages if slugs changed
    if (slugs.vi) revalidatePath(`/san-pham/${slugs.vi}`);
    if (slugs.en) revalidatePath(`/san-pham/${slugs.en}`);

  } catch (error) {
    console.error("Failed to update product:", error);
    // You might want to return an error instead of redirecting immediately
    return { success: false, error: "Failed to update product." };
  }

  // Use locale-aware redirect (default to the first supported locale)
  redirect("/admin/products"); // Redirect on success
}

/**
 * Deletes a product.
 */
export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product." };
  }
}