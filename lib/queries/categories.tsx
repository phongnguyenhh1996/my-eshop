import prisma from "@/lib/prisma";

export async function getCategories(locale: string) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { translations: { _count: 'desc' } }, // Simple ordering
      include: {
        translations: { where: { locale } },
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}