"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { SchemaField } from "../../elements/components/SchemaFieldList"; // Import the type

interface ElementRendererProps {
  schema: SchemaField[];
  data: { [key: string]: unknown };
  onDataChange: (fieldName: string, value: unknown) => void;
}

// Type guard to check if a value is an object
function isObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// This component recursively renders the form for a given schema
export function ElementRenderer({ schema, data, onDataChange }: ElementRendererProps) {
  
  const renderField = (field: SchemaField) => {
    const value = data[field.name];

    switch (field.type) {
      case "text":
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Input
              type="text"
              value={(value as string) || ""}
              onChange={(e) => onDataChange(field.name, e.target.value)}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Textarea
              value={(value as string) || ""}
              onChange={(e) => onDataChange(field.name, e.target.value)}
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
              value={(value as string) || ""}
              onChange={(e) => onDataChange(field.name, e.target.value)}
            />
          </div>
        );
      
      case "object":
        return (
          <div key={field.name} className="space-y-2 rounded-lg border bg-background p-4">
            <Label className="font-semibold">{field.label}</Label>
            <div className="ml-4">
              <ElementRenderer
                schema={field.subSchema || []}
                data={isObject(value) ? value : {}}
                onDataChange={(subFieldName, subValue) => {
                  const currentObject = isObject(value) ? value : {};
                  onDataChange(field.name, {
                    ...currentObject,
                    [subFieldName]: subValue,
                  });
                }}
              />
            </div>
          </div>
        );
        
      case "array":
        const items = (Array.isArray(value) ? value : []) as { id: string, [key: string]: unknown }[];
        
        const addItem = () => {
          const newItem = { id: uuidv4() }; // Add a React key
          onDataChange(field.name, [...items, newItem]);
        };
        const removeItem = (id: string) => {
          onDataChange(field.name, items.filter(item => item.id !== id));
        };
        
        return (
          <div key={field.name} className="space-y-2 rounded-lg border bg-background p-4">
            <Label className="font-semibold">{field.label}</Label>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2 border-l-2 pl-4">
                  <span className="pt-2 text-sm font-medium text-muted-foreground">{index + 1}.</span>
                  <div className="flex-1">
                    {field.itemType === 'object' ? (
                      <ElementRenderer
                        schema={field.subSchema || []}
                        data={item}
                        onDataChange={(subFieldName, subValue) => {
                          const newItem = { ...item, [subFieldName]: subValue };
                          onDataChange(field.name, items.map(i => i.id === item.id ? newItem : i));
                        }}
                      />
                    ) : (
                      <Input
                        type="text"
                        placeholder="Item value..."
                        value={(item.value as string) || ""}
                        onChange={(e) => {
                          const newItem = { ...item, value: e.target.value };
                          onDataChange(field.name, items.map(i => i.id === item.id ? newItem : i));
                        }}
                      />
                    )}
                  </div>
                  <Button type="button" variant="destructive" size="icon" className="mt-2" onClick={() => removeItem(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        );

      default:
        return <div key={field.name}><Label>{field.label}</Label><Input disabled value={`Unknown type: ${field.type}`} /></div>;
    }
  };

  return (
    <div className="space-y-4">
      {schema.map(field => renderField(field))}
    </div>
  );
}