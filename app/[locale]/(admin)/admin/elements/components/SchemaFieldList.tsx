"use client";

import { v4 as uuidv4 } from 'uuid'; // Use `npm install uuid`
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

// This is the type for a single field in the schema
export type SchemaField = {
  id: string; // React key
  name: string;
  label: string;
  type: string;
  itemType?: string; // For 'array'
  subSchema?: SchemaField[]; // For 'object'
};

// Define the available field types
const inputTypes = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "image", label: "Image" },
  { value: "icon", label: "Icon" },
  { value: "array", label: "Array (List)" },
  { value: "object", label: "Object (Nested Fields)" },
];

// Define the available item types for an array
const itemTypes = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "image", label: "Image" },
  { value: "object", label: "Object (Nested Fields)" },
];

interface SchemaFieldListProps {
  fields: SchemaField[];
  setFields: (fields: SchemaField[]) => void;
}

export function SchemaFieldList({ fields, setFields }: SchemaFieldListProps) {
  
  const addField = () => {
    setFields([...fields, { id: uuidv4(), name: "", label: "", type: "text", subSchema: [] }]);
  };

  const updateField = (id: string, fieldName: keyof SchemaField, value: unknown) => {
    setFields(
      fields.map(field =>
        field.id === id ? { ...field, [fieldName]: value } : field
      )
    );
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      {fields.map((field) => (
        <div key={field.id} className="space-y-3 p-3 border rounded-md bg-background">
          {/* Main field definition row */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center">
            <Input
              placeholder="Name (e.g., title)"
              className="col-span-2"
              value={field.name}
              onChange={(e) => updateField(field.id, 'name', e.target.value)}
              required
            />
            <Input
              placeholder="Label (e.g., Title)"
              className="col-span-2"
              value={field.label}
              onChange={(e) => updateField(field.id, 'label', e.target.value)}
              required
            />
            <Select
              value={field.type}
              onValueChange={(value) => updateField(field.id, 'type', value)}
              required
            >
              <SelectTrigger className="col-span-2"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{inputTypes.map(t => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent>
            </Select>
            <div className="col-span-1">
              {/* Show ItemType select ONLY for 'array' */}
              {field.type === 'array' && (
                <Select
                  value={field.itemType}
                  onValueChange={(value) => updateField(field.id, 'itemType', value)}
                  required
                >
                  <SelectTrigger><SelectValue placeholder="Item type" /></SelectTrigger>
                  <SelectContent>{itemTypes.map(t => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent>
                </Select>
              )}
            </div>
            <Button type="button" variant="destructive" size="icon" className="col-span-1" onClick={() => removeField(field.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* --- RECURSIVE PART --- */}
          {/* If type is 'object', show the sub-schema editor */}
          {field.type === 'object' && (
            <div className="ml-8 pl-4 border-l-2">
              <Label className="text-sm text-muted-foreground">Object Fields:</Label>
              <SchemaFieldList
                fields={field.subSchema || []}
                setFields={(newSubSchema) => {
                  updateField(field.id, 'subSchema', newSubSchema);
                }}
              />
            </div>
          )}
          {/* If type is 'array' AND itemType is 'object', also show the sub-schema editor */}
          {field.type === 'array' && field.itemType === 'object' && (
             <div className="ml-8 pl-4 border-l-2">
              <Label className="text-sm text-muted-foreground">Fields for *each* item in the list:</Label>
              <SchemaFieldList
                fields={field.subSchema || []}
                setFields={(newSubSchema) => {
                  updateField(field.id, 'subSchema', newSubSchema);
                }}
              />
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addField}>
        <Plus className="mr-2 h-4 w-4" /> Add Field
      </Button>
    </div>
  );
}