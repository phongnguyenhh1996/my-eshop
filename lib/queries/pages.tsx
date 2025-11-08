import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getPagesForAdmin() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
    });
    return pages;
  } catch (error) {
    console.error("Failed to fetch elements for admin:", error);
    return [];
  }
}

export type Page = Prisma.PromiseReturnType<
  typeof getPagesForAdmin
>[number];