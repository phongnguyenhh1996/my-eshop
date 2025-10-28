import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Get a single product for the edit page or detail page
export async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        translations: true, // Fetch all translations
      },
    });
    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

// Get all products for the admin data table
export async function getProductsForAdmin(locale: string) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        translations: { where: { locale } },
        category: {
          include: { translations: { where: { locale } } },
        },
      },
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products for admin:", error);
    return [];
  }
}

// Infer the type for the data table rows based on the query above
export type ProductRowType = Prisma.PromiseReturnType<
  typeof getProductsForAdmin
>[number];