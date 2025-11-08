import prisma from "@/lib/prisma";
import { updatePage } from "@/app/actions/page-actions";
import { PageForm } from "../../components/PageForm"; // Import the shared form
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    pageId: string;
  };
}

export default async function EditPage({ params }: PageProps) {
  const { pageId } = await params;

  // Fetch both the page data and the blueprints in parallel
  const [page, blueprints] = await Promise.all([
    prisma.page.findUnique({
      where: { id: pageId },
    }),
    prisma.elementBlueprint.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <PageForm
      initialData={page} // Pass the fetched page data
      blueprints={blueprints}
      saveAction={updatePage.bind(null, page.id)} // Pass the update action, bound with the pageId
    />
  );
}