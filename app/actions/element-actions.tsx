"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

// This type defines the structure of a single field
type SchemaField = {
  name: string;
  label: string;
  type: string;
  itemType?: string;
};

// Helper function to zip the form data arrays into JSON
function zipFormData(formData: FormData): SchemaField[] {
  const schemaNames = formData.getAll("schema_name") as string[];
  const schemaLabels = formData.getAll("schema_label") as string[];
  const schemaTypes = formData.getAll("schema_type") as string[];
  const schemaItemTypes = formData.getAll("schema_itemType") as string[];
  console.log("schemaItemTypes", schemaItemTypes);

  return schemaNames.map((name, index) => {
    const type = schemaTypes[index];
    const itemType = schemaItemTypes[index];
    return {
      name: name,
      label: schemaLabels[index],
      type,
      itemType: type === "array" && itemType ? itemType : undefined,
    };
  });
}

// ACTION 1: CREATE BLUEPRINT
export async function createElementBlueprint(formData: FormData) {
  const name = formData.get("name") as string;
  const identifier = formData.get("identifier") as string;
  const schemaJson = zipFormData(formData);

  try {
    await prisma.elementBlueprint.create({
      data: {
        name,
        identifier,
        schema: schemaJson as unknown as Prisma.JsonArray,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred." };
  }

  revalidatePath("/admin/elements");
  redirect("/admin/elements");
}

// ACTION 2: UPDATE BLUEPRINT
export async function updateElementBlueprint(
  blueprintId: string,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const identifier = formData.get("identifier") as string;
  const schemaJson = zipFormData(formData);

  try {
    await prisma.elementBlueprint.update({
      where: { id: blueprintId },
      data: {
        name,
        identifier,
        schema: schemaJson as unknown as Prisma.JsonArray,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred." };
  }

  revalidatePath("/admin/elements");
  revalidatePath(`/admin/elements/edit/${blueprintId}`);
  redirect("/admin/elements");
}
