"use client"

import { SelectedIcon } from "@/components/icon-selector";

interface HighlightItem {
  icon: string;
  title: string;
  description: string;
}

export interface HightlightProps {
  items?: HighlightItem[];
}

export function Hightlight({ items = [] }: HightlightProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100 py-4 lg:py-8">
      <div className="container mx-auto px-3 flex md:flex-row flex-wrap divide-y md:divide-y-0 lg:divide-x divide-gray-300">
        {items.map((item, index) => (
          <div
            key={index}
            className="md:basis-1/2 lg:basis-1/4 flex items-center py-2 lg:justify-center"
          >
            <SelectedIcon 
              iconName={item.icon} 
              className="h-10 w-10 mr-2" 
              stroke={1}
            />
            <div className="flex flex-col">
              <h4 className="font-medium text-sm lg:text-base">
                {item.title}
              </h4>
              <p className="text-sm text-gray-700">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}