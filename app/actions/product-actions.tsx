"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { getCategories } from "@/lib/queries/categories";

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

export async function deleteManyProducts(productIds: string[]) {
  if (!productIds || productIds.length === 0) {
    return { success: false, error: "No product IDs provided." };
  }

  try {
    const deleteResult = await prisma.product.deleteMany({
      where: {
        id: {
          in: productIds, // Use the 'in' filter to delete all IDs in the array
        },
      },
    });

    // Revalidate all paths that show products
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/san-pham", "layout");

    return { success: true, count: deleteResult.count };
  } catch (error) {
    console.error("Failed to delete products:", error);
    return { success: false, error: "Failed to delete products." };
  }
}

type TikTokProductRow = {
  product_id: string;
  category: string;
  product_name: string;
  product_description: string;
  price: string;
  quantity: string;
  seller_sku: string;
  sku_id: string;
  main_image: string;
  [key: string]: unknown; // Allow other properties
};

function isTikTokProductRow(obj: unknown): obj is TikTokProductRow {
  if (typeof obj !== 'object' || obj === null) return false;
  return 'product_id' in obj && 'product_name' in obj && 'price' in obj && 'quantity' in obj;
}

export async function syncProductsFromExcel(products: unknown[]) {
  // 1. Fetch all existing categories to act as a cache.
  const allMyCategories = await getCategories("vi");

  // 2. Fetch all existing 'vi' product names to check for duplicates.
  const existingProductTranslations = await prisma.productTranslation.findMany({
    where: { locale: 'vi' },
    select: { name: true }
  });
  // Use a Set for fast lookup
  const existingProductNames = new Set(existingProductTranslations.map(p => p.name));
  
  // 3. Set a fallback category ID
  const defaultCategoryId = "0"; // <<< PLEASE REPLACE THIS

  let createdCount = 0;
  let skippedCount = 0;

  try {
    for (const item of products) {
      if (!isTikTokProductRow(item)) {
        continue; // Skip unknown objects
      }
      
      const row = item;

      // 4. Skip junk/header rows
      if (!row.product_id || row.product_id === 'ID sản phẩm' || String(row.product_id).startsWith('V3')) {
        continue;
      }

      const name = row.product_name;
      const price = parseFloat(row.price);
      const stock = parseInt(row.quantity);
      if (!name || isNaN(price) || isNaN(stock)) {
        console.warn("Skipping row with invalid data:", row.product_name);
        continue;
      }
      
      // 5. --- NEW LOGIC: Check for duplicates by name ---
      if (existingProductNames.has(name)) {
        console.log(`Skipping duplicate product: ${name}`);
        skippedCount++;
        continue; // Skip this product, it already exists
      }
      // --- END OF NEW LOGIC ---

      // 6. Find or create category (same as before)
      let categoryId: string;
      const tiktokCategoryName = row.category.split(' ');
      tiktokCategoryName.pop();
      const categoryName = tiktokCategoryName.join(' ');

      if (!tiktokCategoryName) {
        categoryId = defaultCategoryId;
      } else {
        const myCategory = allMyCategories.find(c => c.translations[0]?.name === categoryName || c.translations[1]?.name === categoryName);
        if (myCategory) {
          categoryId = myCategory.id;
        } else {
          const newCategory = await prisma.category.create({
            data: {
              translations: {
                create: [
                  { locale: "vi", name: categoryName },
                  { locale: "en", name: categoryName } 
                ]
              }
            },
            include: {
              translations: { where: { locale: "vi" } }
            }
          });
          categoryId = newCategory.id;
          allMyCategories.push(newCategory);
        }
      }

      // 7. Collect images
      const imageUrls: string[] = [];
      if (row.main_image) imageUrls.push(row.main_image);
      for (let i = 2; i <= 9; i++) {
        const key = `image_${i}`;
        if (row[key] && typeof row[key] === 'string') {
          imageUrls.push(row[key] as string);
        }
      }

      // 8. Prepare translation data
      const productNameVI = name;
      const productNameEN = name; // Default 'en' name to 'vi' name
      const descriptionVI = row.product_description || "";
      const descriptionEN = row.product_description || "";
      
      const translationData = [
         { locale: "vi", name: productNameVI, description: descriptionVI, slug: slugify(productNameVI, { lower: true, strict: true, locale: 'vi' }) },
         { locale: "en", name: productNameEN, description: descriptionEN, slug: slugify(productNameEN, { lower: true, strict: true }) }
      ];

      // 9. Perform 'create' (no longer 'upsert')
      await prisma.product.create({
        data: {
          // No SKU field is included
          price, 
          stock, 
          images: imageUrls, 
          categoryId: categoryId,
          translations: {
            create: translationData
          }
        },
      });
      createdCount++;
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    
    return { success: true, count: createdCount, skipped: skippedCount };

  } catch (error: unknown) {
    console.error("Sync failed:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred during sync." };
  }
}