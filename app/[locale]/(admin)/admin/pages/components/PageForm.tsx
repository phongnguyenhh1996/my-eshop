"use client";

import { useState, useTransition } from "react";
import { Prisma, ElementBlueprint } from "@prisma/client";
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ArrayFieldRenderer } from "./ArrayRender";
import { ObjectRender } from "./ObjectRender"

// --- Helper Type Definitions ---
// This defines the shape of the Page data we expect
type PageData = {
  id: string;
  name: string;
  slug: string;
  content: Prisma.JsonValue;
} | null; // Can be null for create mode

// This is the structure for a single element in our 'content' array
type ContentElement = {
  id: string; // Unique ID for React state
  type: string; // The blueprint identifier (e.g., "hero_banner")
  data: { [key: string]: unknown }; // The actual content (e.g., { title: "..." })
};

// This is the structure of a blueprint's schema field
type SchemaField = {
  name: string;
  label: string;
  type: string;
};

// --- Prop Definition ---
type SaveResult = {
  success: boolean;
  error?: string;
};

interface PageFormProps {
  initialData: PageData;
  blueprints: ElementBlueprint[];
  // The action will be 'createPage' or 'updatePage'
  saveAction: (data: {
    name: string;
    slug: string;
    content: unknown[];
  }) => Promise<SaveResult>;
}

export function PageForm({
  initialData,
  blueprints,
  saveAction,
}: PageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isCreateMode = initialData === null;

  // --- State ---
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "/");
  const [content, setContent] = useState<ContentElement[]>(() =>
    Array.isArray(initialData?.content)
      ? (initialData.content as ContentElement[])
      : []
  );

  // --- Content Management Functions ---
  const addElement = (identifier: string) => {
    const blueprint = blueprints.find((b) => b.identifier === identifier);
    if (!blueprint) return;
    const newElement: ContentElement = {
      id: Date.now().toString(),
      type: identifier,
      data: {},
    };
    setContent((prev) => [...prev, newElement]);
  };

  const removeElement = (id: string) => {
    setContent((prev) => prev.filter((el) => el.id !== id));
  };

  const moveElement = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.length) return;
    setContent((prev) => {
      const newContent = [...prev];
      const [element] = newContent.splice(index, 1);
      newContent.splice(newIndex, 0, element);
      return newContent;
    });
  };

  const updateElementData = (id: string, fieldName: string, value: unknown) => {
    setContent((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, data: { ...el.data, [fieldName]: value } } : el
      )
    );
  };

  // --- Dynamic Form Renderer ---
  const renderElementForm = (element: ContentElement) => {
    const blueprint = blueprints.find((b) => b.identifier === element.type);
    if (!blueprint || !Array.isArray(blueprint.schema)) return null;

    return (
      <div
        key={element.id}
        className="border p-4 rounded-lg space-y-4 bg-muted/20"
      >
        <div className="flex justify-between items-center pb-2 border-b">
          <h4 className="font-semibold text-lg">{blueprint.name}</h4>
          <div className="flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => moveElement(content.indexOf(element), "up")}
              disabled={content.indexOf(element) === 0}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => moveElement(content.indexOf(element), "down")}
              disabled={content.indexOf(element) === content.length - 1}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => removeElement(element.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {(blueprint.schema as SchemaField[]).map((field) => {
          const value = element.data[field.name] as string | undefined;

          switch (field.type) {
            case "text":
              return (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Input
                    type="text"
                    value={value || ""}
                    onChange={(e) =>
                      updateElementData(element.id, field.name, e.target.value)
                    }
                  />
                </div>
              );
            case "textarea":
              return (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Textarea
                    value={value || ""}
                    onChange={(e) =>
                      updateElementData(element.id, field.name, e.target.value)
                    }
                  />
                </div>
              );
            case "image":
              return (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Input
                    type="text"
                    placeholder="Enter Image URL..."
                    value={value || ""}
                    onChange={(e) =>
                      updateElementData(element.id, field.name, e.target.value)
                    }
                  />
                </div>
              );
            case "array":
              return (
                <ArrayFieldRenderer
                  key={field.name}
                  elementId={element.id}
                  field={field}
                  value={value}
                  updateElementData={updateElementData}
                />
              );
            case "object":
              return (
                <ObjectRender
                  key={field.name}
                  elementId={element.id}
                  field={field}
                  value={value} // Pass the current value (or undefined)
                  updateElementData={updateElementData}
                />
              );
            default:
              return (
                <div key={field.name}>
                  <Label>{field.label}</Label>
                  <Input type="text" value={value || ""} disabled />
                  <p className="text-sm text-red-500">
                    Unknown field type: {field.type}
                  </p>
                </div>
              );
          }
        })}
      </div>
    );
  };

  // --- Main Submit Handler ---
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await saveAction({ name, slug, content });
      if (result.success) {
        alert("Page saved!");
        router.push("/admin/pages");
      } else {
        alert(`Error: ${result.error}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            {isCreateMode ? "Create New Page" : "Edit Page"}
          </CardTitle>
          <CardDescription>
            {isCreateMode
              ? "Configure your new page."
              : "Edit your page properties and content."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Page Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="/about-us"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.length > 0 ? (
            content.map((el, index) => renderElementForm(el))
          ) : (
            <p className="text-center text-muted-foreground">
              No elements added yet.
            </p>
          )}

          <div className="flex gap-2">
            <Select onValueChange={addElement}>
              <SelectTrigger>
                <SelectValue placeholder="Add an element..." />
              </SelectTrigger>
              <SelectContent>
                {blueprints.map((bp) => (
                  <SelectItem key={bp.id} value={bp.identifier}>
                    {bp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save Page"
          )}
        </Button>
      </div>
    </form>
  );
}
