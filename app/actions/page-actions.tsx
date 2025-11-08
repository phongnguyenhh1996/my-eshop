"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// This is the shape of the data our form will send
type PageData = {
  name: string;
  slug: string;
  // 'unknown' is safer than 'any' and can be cast to Prisma.JsonArray
  content: unknown[]; 
};

// --- ACTION 1: CREATE PAGE ---
export async function createPage(data: PageData) {
  try {
    const { name, slug, content } = data;
    if (!name || !slug) {
      throw new Error("Name and Slug are required.");
    }
    
    await prisma.page.create({
      data: {
        name,
        slug: slug.startsWith('/') ? slug : `/${slug}`, // Ensure slug starts with /
        content: content as Prisma.JsonArray,
      },
    });

    revalidatePath("/admin/pages");
    revalidatePath("/", "layout"); // Revalidate all pages
    
    return { success: true };

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred." };
  }
}

// --- ACTION 2: UPDATE PAGE ---
export async function updatePage(pageId: string, data: PageData) {
  try {
    const { name, slug, content } = data;
    if (!name || !slug) {
      throw new Error("Name and Slug are required.");
    }

    await prisma.page.update({
      where: { id: pageId },
      data: {
        name,
        slug: slug.startsWith('/') ? slug : `/${slug}`,
        content: content as Prisma.JsonArray,
      },
    });
    
    revalidatePath("/admin/pages");
    revalidatePath("/", "layout"); // Revalidate all pages

    return { success: true };

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred." };
  }
}