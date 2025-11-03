import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getElementsForAdmin() {
  try {
    const elements = await prisma.elementBlueprint.findMany({
      orderBy: { createdAt: "desc" },
    });
    return elements;
  } catch (error) {
    console.error("Failed to fetch elements for admin:", error);
    return [];
  }
}

export type Element = Prisma.PromiseReturnType<
  typeof getElementsForAdmin
>[number];