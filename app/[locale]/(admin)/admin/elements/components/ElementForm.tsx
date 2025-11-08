"use client";

import { useState, useTransition } from "react";
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
import { Plus, X, Loader2 } from "lucide-react";
import { Prisma } from "@prisma/client"; // For the type

// Define the type for a single schema field state
type SchemaFieldState = {
  id: number; // A unique ID for React's 'key' prop
  name: string;
  label: string;
  type: string;
  itemType: string;
};

// Define the type for the props this component accepts
interface ElementFormProps {
  // The Server Action to call on submit (can be 'create' or 'update')
  saveAction: (formData: FormData) => Promise<unknown>;
  // The data to pre-fill the form (null for create mode)
  initialData: {
    name: string;
    identifier: string;
    schema: Prisma.JsonValue;
  } | null;
}

// Helper to initialize the state from initialData
type RawSchemaField = {
  name?: string;
  label?: string;
  type?: string;
  itemType?: string;
};

function initializeFields(
  schema: Prisma.JsonValue | undefined
): SchemaFieldState[] {
  if (Array.isArray(schema)) {
    return schema.map((field, index) => {
      const f = field as unknown as RawSchemaField;
      return {
        id: Date.now() + index, // Create a unique ID
        name: f.name ?? "",
        label: f.label ?? "",
        type: f.type ?? "text",
        itemType: f.itemType ?? "text",
      };
    });
  }
  // Default for create mode
  return [
    {
      id: Date.now(),
      name: "title",
      label: "Title",
      type: "text",
      itemType: "text",
    },
  ];
}

export function ElementForm({ saveAction, initialData }: ElementFormProps) {
  const [isPending, startTransition] = useTransition();
  const [schemaFields, setSchemaFields] = useState<SchemaFieldState[]>(() =>
    initializeFields(initialData?.schema)
  );

  // --- State management functions ---
  const addField = () => {
    setSchemaFields((prev) => [
      ...prev,
      { id: Date.now(), name: "", label: "", type: "text", itemType: "text" },
    ]);
  };

  const updateField = (
    id: number,
    fieldName: "name" | "label" | "type" | "itemType",
    value: string
  ) => {
    setSchemaFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [fieldName]: value } : field
      )
    );
  };

  const removeField = (id: number) => {
    if (schemaFields.length > 1) {
      setSchemaFields((prev) => prev.filter((field) => field.id !== id));
    }
  };

  // --- Form submission handler ---
  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = (await saveAction(formData)) as
        | { success: boolean; error: string }
        | undefined;
      if (result?.success === false) {
        alert(`Error: ${result.error}`);
        // In a real app, you'd use a toast notification here
      }
      // On success, the action handles the redirect
    });
  };

  const inputTypes = [
    { value: "text", label: "Text" },
    { value: "textarea", label: "Text Area" },
    { value: "image", label: "Image" },
    { value: "product", label: "Product (Single)" },
    { value: "product_list", label: "Product List" },
    { value: "array", label: "Array (List)" },
    { value: "object", label: "Object (Key-Value)" },
  ];

  const itemTypes = [
    { value: "text", label: "Text" },
    { value: "textarea", label: "Text Area" },
    { value: "image", label: "Image" },
    { value: "object", label: "Object (Key-Value)" },
  ];

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData
            ? "Edit Element Blueprint"
            : "Create New Element Blueprint"}
        </CardTitle>
        <CardDescription>
          {initialData
            ? "Update the element's structure."
            : "Define the structure of a reusable content element."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {/* Static Fields: Name and Identifier */}
          <div className="space-y-2">
            <Label htmlFor="name">Element Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Hero Banner"
              required
              defaultValue={initialData?.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identifier">Identifier</Label>
            <Input
              id="identifier"
              name="identifier"
              placeholder="e.g., hero_banner"
              required
              defaultValue={initialData?.identifier}
            />
          </div>

          {/* Dynamic Schema Fields */}
          <div className="space-y-2">
            <Label>Schema Fields</Label>
            <div className="space-y-4 rounded-lg border p-4">
              {schemaFields.map((field) => (
                <div
                  key={field.id}
                  className="grid grid-cols-7 gap-4 items-center"
                >
                  <Input
                    name="schema_name"
                    placeholder="name"
                    className="col-span-2"
                    value={field.name}
                    onChange={(e) =>
                      updateField(field.id, "name", e.target.value)
                    }
                    required
                  />
                  <Input
                    name="schema_label"
                    placeholder="Label"
                    className="col-span-2"
                    value={field.label}
                    onChange={(e) =>
                      updateField(field.id, "label", e.target.value)
                    }
                    required
                  />
                  <Select
                    name="schema_type"
                    value={field.type}
                    onValueChange={(value) =>
                      updateField(field.id, "type", value)
                    }
                    required
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inputTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* --- NEW: Item Type Select (Conditionally Rendered) --- */}
                  <div className="col-span-3">
                    {field.type === "array" ? (
                      // 1. If type is 'array', show the normal Select box
                      <Select
                        name="schema_itemType"
                        value={field.itemType}
                        onValueChange={(value) =>
                          updateField(field.id, "itemType", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item type" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      // 2. Otherwise, render a hidden input with an empty value
                      // This ensures formData.getAll('schema_itemType') has the same length
                      <input type="hidden" name="schema_itemType" value="" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="col-span-1"
                    onClick={() => removeField(field.id)}
                    disabled={schemaFields.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addField}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Field
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Blueprint"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
