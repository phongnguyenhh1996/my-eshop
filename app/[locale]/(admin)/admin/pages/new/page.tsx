import prisma from "@/lib/prisma";
import { createPage } from "@/app/actions/page-actions";
import { PageForm } from "../components/PageForm"; // Import the shared form

export default async function NewPage() {
  // Fetch all available blueprints
  const blueprints = await prisma.elementBlueprint.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <PageForm
      initialData={null} // Pass null for create mode
      blueprints={blueprints}
      saveAction={createPage} // Pass the create action
    />
  );
}