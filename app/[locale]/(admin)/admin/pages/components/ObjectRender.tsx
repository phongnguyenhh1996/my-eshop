"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

// This is the structure of a field in the blueprint's schema
type SchemaField = {
  name: string;
  label: string;
  type: string;
};

// This is the structure of a single key-value item
type KeyValueItem = {
  id: string; // For React key
  key: string;
  value: string;
};

interface ObjectFieldRendererProps {
  elementId: string;
  field: SchemaField;
  value: unknown; // The current value of the object (e.g., element.data[field.name])
  updateElementData: (id: string, fieldName: string, value: unknown) => void;
}

export function ObjectRender({
  elementId,
  field,
  value,
  updateElementData,
}: ObjectFieldRendererProps) {
  // Ensure the value is always an array of KeyValueItem
  const items: KeyValueItem[] = Array.isArray(value) ? value : [];

  const updateParent = (newItems: KeyValueItem[]) => {
    updateElementData(elementId, field.name, newItems);
  };

  const addItem = () => {
    const newItem: KeyValueItem = {
      id: uuidv4(),
      key: "",
      value: "",
    };
    updateParent([...items, newItem]);
  };

  const removeItem = (idToRemove: string) => {
    const newItems = items.filter((item) => item.id !== idToRemove);
    updateParent(newItems);
  };

  const updateItem = (idToUpdate: string, part: 'key' | 'value', newValue: string) => {
    const newItems = items.map((item) =>
      item.id === idToUpdate ? { ...item, [part]: newValue } : item
    );
    updateParent(newItems);
  };

  return (
    <div className="space-y-2 rounded-lg border bg-background p-4">
      <Label>{field.label}</Label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Key (e.g., Material)"
              value={item.key}
              onChange={(e) => updateItem(item.id, 'key', e.target.value)}
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Value (e.g., Cotton)"
              value={item.value}
              onChange={(e) => updateItem(item.id, 'value', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeItem(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="mr-2 h-4 w-4" /> Add Key-Value Pair
      </Button>
    </div>
  );
}