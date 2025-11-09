"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

// This is the type of data our new form will send.
// 'unknown' is used because it's a nested JSON structure.
export type ElementBlueprintData = {
  name: string;
  identifier: string;
  schema: unknown[]; 
};

// --- ACTION 1: CREATE BLUEPRINT ---
export async function createElementBlueprint(data: ElementBlueprintData) {
  try {
    const { name, identifier, schema } = data;
    await prisma.elementBlueprint.create({
      data: {
        name,
        identifier,
        schema: schema as Prisma.JsonArray,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: "An unknown error occurred." };
  }

  revalidatePath("/admin/elements");
  redirect("/admin/elements");
}

// --- ACTION 2: UPDATE BLUEPRINT ---
export async function updateElementBlueprint(
  blueprintId: string,
  data: ElementBlueprintData
) {
  try {
    const { name, identifier, schema } = data;
    await prisma.elementBlueprint.update({
      where: { id: blueprintId },
      data: {
        name,
        identifier,
        schema: schema as Prisma.JsonArray,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: "An unknown error occurred." };
  }

  revalidatePath("/admin/elements");
  revalidatePath(`/admin/elements/edit/${blueprintId}`);
  redirect("/admin/elements");
}