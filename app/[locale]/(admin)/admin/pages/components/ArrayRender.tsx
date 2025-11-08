"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
// 1. Import the ObjectFieldRenderer
import { ObjectRender } from "./ObjectRender"; 

// --- (Type Definitions) ---
type SchemaField = {
  name: string;
  label: string;
  type: string;
  itemType?: string; // This is now very important
};

type ArrayItem = {
  id: string; // For React key
  value: unknown; // Use 'unknown' to hold a string OR an object
};

interface ArrayFieldRendererProps {
  elementId: string;
  field: SchemaField;
  value: unknown; 
  updateElementData: (id: string, fieldName: string, value: unknown) => void;
}

export function ArrayFieldRenderer({
  elementId,
  field,
  value,
  updateElementData,
}: ArrayFieldRendererProps) {
  
  // 2. Ensure the value is always an array of ArrayItem
  const items: ArrayItem[] = Array.isArray(value) ? value : [];

  const updateParent = (newItems: ArrayItem[]) => {
    updateElementData(elementId, field.name, newItems);
  };

  const addItem = () => {
    // 3. Create a new item with a default value based on itemType
    const newItem: ArrayItem = {
      id: uuidv4(),
      value: field.itemType === 'object' ? [] : "", // Default to empty array for object
    };
    updateParent([...items, newItem]);
  };

  const removeItem = (idToRemove: string) => {
    const newItems = items.filter((item) => item.id !== idToRemove);
    updateParent(newItems);
  };

  // 4. Update the value for a specific item in the array
  const updateItemValue = (idToUpdate: string, newValue: unknown) => {
    const newItems = items.map((item) =>
      item.id === idToUpdate ? { ...item, value: newValue } : item
    );
    updateParent(newItems);
  };

  // 5. This function now renders the correct input based on itemType
  const renderItemInput = (item: ArrayItem) => {
    console.log(field.itemType);
    
    switch (field.itemType) {
      case "object":
        return (
          <ObjectRender
            elementId={item.id} // Pass item.id as a unique key for its sub-fields
            field={field} // Pass the field config (though it's not strictly needed here)
            value={item.value} // Pass the object value
            // This is a "local" update function for this specific item
            updateElementData={(_elementId, _fieldName, newValue) => {
              updateItemValue(item.id, newValue);
            }}
          />
        );
      case "image":
        return (
          <Input
            type="text"
            placeholder="Image URL..."
            value={item.value as string}
            onChange={(e) => updateItemValue(item.id, e.target.value)}
          />
        );
      case "text":
      default:
        return (
          <Input
            type="text"
            placeholder="Item value..."
            value={item.value as string}
            onChange={(e) => updateItemValue(item.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2 rounded-lg border bg-background p-4">
      <Label>{field.label}</Label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-start gap-2 border-l-2 pl-4">
            <span className="pt-2 text-sm font-medium text-muted-foreground">{index + 1}.</span>
            <div className="flex-1">
              {renderItemInput(item)}
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="mt-2" // Align with inputs
              onClick={() => removeItem(item.id)}
            >
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
}