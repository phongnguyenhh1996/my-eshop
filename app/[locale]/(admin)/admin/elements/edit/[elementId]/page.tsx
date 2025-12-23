import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ElementForm } from "../../components/ElementForm";
import { updateElementBlueprint } from "@/app/actions/element-actions";
import { getElementById } from "@/lib/queries/elements";

export default async function CreateElementPage({params}: { params: { elementId: string; locale: string } }) {
  const { elementId } = await params
  const element = await getElementById(elementId)
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Element Blueprint</CardTitle>
        <CardDescription>
          Define the structure of a reusable content element.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ElementForm saveAction={updateElementBlueprint.bind(null, elementId)} initialData={element} />
      </CardContent>
    </Card>
  );
}