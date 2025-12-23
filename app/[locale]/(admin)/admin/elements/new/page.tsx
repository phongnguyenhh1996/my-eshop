import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ElementForm } from "../components/ElementForm";
import { createElementBlueprint } from "@/app/actions/element-actions";

export default async function CreateElementPage() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Element Blueprint</CardTitle>
        <CardDescription>
          Define the structure of a reusable content element.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ElementForm saveAction={createElementBlueprint} initialData={null} />
      </CardContent>
    </Card>
  );
}