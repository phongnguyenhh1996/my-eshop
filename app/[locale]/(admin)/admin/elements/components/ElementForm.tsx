"use client";

import { useState, useTransition } from "react";
import { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { SchemaFieldList, SchemaField } from "./SchemaFieldList"; // Import new component
import { ElementBlueprintData } from "@/app/actions/element-actions";

// --- Type Definitions ---
interface ElementFormProps {
  saveAction: (data: ElementBlueprintData) => Promise<{success: boolean, error?: string} | void>;
  initialData: {
    name: string;
    identifier: string;
    schema: Prisma.JsonValue;
  } | null;
}

// --- Type Guard to safely check the structure ---
// This replaces (field as any).name
function isSchemaField(field: unknown): field is Partial<SchemaField> {
  return typeof field === 'object' && field !== null;
}

// --- Helper Functions ---
function initializeState(schema: Prisma.JsonValue | undefined): SchemaField[] {
  if (Array.isArray(schema)) {
    // Recursively assign unique IDs for React state
    const assignIds = (fields: unknown[]): SchemaField[] => {
      return fields.map((field) => {
        // Use the type guard for safety
        if (isSchemaField(field)) {
          return {
            id: uuidv4(),
            name: field.name || "",
            label: field.label || "",
            type: field.type || "text",
            itemType: field.itemType || "text",
            subSchema: field.subSchema ? assignIds(field.subSchema) : [],
          };
        }
        // Fallback for corrupt data
        return { id: uuidv4(), name: "", label: "", type: "text", subSchema: [] };
      });
    };
    return assignIds(schema);
  }
  return [];
}

// This strips the 'id' field before saving to DB
function cleanForSave(schema: SchemaField[]): unknown[] {
  return schema.map(({ id, ...field }) => ({
    ...field,
    subSchema: field.subSchema ? cleanForSave(field.subSchema) : undefined,
  }));
}

// --- The Main Form Component ---
export function ElementForm({ saveAction, initialData }: ElementFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialData?.name || "");
  const [identifier, setIdentifier] = useState(initialData?.identifier || "");
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>(() =>
    initializeState(initialData?.schema)
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const dataToSave = {
        name,
        identifier,
        schema: cleanForSave(schemaFields), // Clean the state for DB
      };
      
      const result = await saveAction(dataToSave);
      
      if (result?.success === false) {
        alert(`Error: ${result.error}`);
      }
      // Redirect is handled by the server action
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Blueprint" : "Create Blueprint"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Static Fields: Name and Identifier */}
          <div className="space-y-2">
            <Label htmlFor="name">Element Name</Label>
            <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identifier">Identifier</Label>
            <Input id="identifier" name="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          </div>

          {/* Dynamic Schema Fields */}
          <div className="space-y-2">
            <Label>Schema Fields</Label>
            <SchemaFieldList
              fields={schemaFields}
              setFields={setSchemaFields}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Blueprint"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}