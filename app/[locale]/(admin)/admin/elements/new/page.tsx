// file: app/[locale]/(admin)/admin/elements/new/page.tsx

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function CreateElementPage() {

  async function createElementBlueprint(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const identifier = formData.get("identifier") as string;
    const schemaString = formData.get("schema") as string;
    
    let schemaJson;
    try {
      schemaJson = JSON.parse(schemaString);
    } catch (error) {
      console.error("Invalid JSON schema:", error);
      // You should return an error to the user here
      return;
    }

    await prisma.elementBlueprint.create({
      data: {
        name,
        identifier,
        schema: schemaJson,
      },
    });

    redirect("/admin");
  }

  const exampleSchema = `[
  { "name": "title", "label": "Title", "type": "text" },
  { "name": "subtitle", "label": "Subtitle", "type": "text" },
  { "name": "image", "label": "Background Image", "type": "image" }
]`;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Element Blueprint</CardTitle>
        <CardDescription>
          Define the structure of a reusable content element.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createElementBlueprint} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Element Name</Label>
            <Input id="name" name="name" placeholder="e.g., Hero Banner" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identifier">Identifier</Label>
            <Input id="identifier" name="identifier" placeholder="e.g., hero_banner" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schema">Schema (JSON)</Label>
            <Textarea
              id="schema"
              name="schema"
              rows={10}
              placeholder="Define your element's fields here..."
              defaultValue={exampleSchema}
            />
            <p className="text-sm text-muted-foreground">
              Define your fields as an array of objects.
            </p>
          </div>
          <Button type="submit" className="w-full">
            Save Blueprint
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}