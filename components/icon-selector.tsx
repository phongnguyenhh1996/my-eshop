"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as LucideIcons from "lucide-react";
import * as TablerIcons from "@tabler/icons-react";

interface SelectedIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'stroke'> {
  iconName: string;
  stroke?: number | string;
}

// Component to render a selected icon by name
export function SelectedIcon({ iconName, stroke, ...props }: SelectedIconProps) {
  if (!iconName) return null;
  
  // Prepare props with stroke converted to string if needed
  const iconProps = {
    ...props,
    ...(stroke !== undefined && { stroke: typeof stroke === 'number' ? stroke.toString() : stroke })
  } as React.SVGProps<SVGSVGElement> & { stroke?: number | string };
  
  // Check if value has library prefix (lucide: or tabler:)
  if (iconName.includes(':')) {
    const [library, name] = iconName.split(':');
    const iconLib = library === 'lucide' ? LucideIcons : TablerIcons;
    const Icon = (iconLib as unknown as Record<string, unknown>)[name];
    if (typeof Icon === 'function') {
      const IconComponent = Icon as React.ComponentType<React.SVGProps<SVGSVGElement> & { stroke?: number | string }>;
      return <IconComponent {...iconProps} />;
    }
    if (typeof Icon === 'object' && Icon !== null) {
      const IconComponent = Icon as React.ComponentType<React.SVGProps<SVGSVGElement> & { stroke?: number | string }>;
      return <IconComponent {...iconProps} />;
    }
  } else {
    // Backward compatibility: try lucide first, then tabler
    let Icon = (LucideIcons as unknown as Record<string, unknown>)[iconName];
    if (!Icon || (typeof Icon !== 'function' && typeof Icon !== 'object')) {
      Icon = (TablerIcons as unknown as Record<string, unknown>)[iconName];
    }
    if (typeof Icon === 'function') {
      const IconComponent = Icon as React.ComponentType<React.SVGProps<SVGSVGElement> & { stroke?: number | string }>;
      return <IconComponent {...iconProps} />;
    }
    if (typeof Icon === 'object' && Icon !== null) {
      const IconComponent = Icon as React.ComponentType<React.SVGProps<SVGSVGElement> & { stroke?: number | string }>;
      return <IconComponent {...iconProps} />;
    }
  }
  return null;
}

interface IconSelectorProps {
  label: string;
  value: string;
  onChange: (iconName: string) => void;
}

export function IconSelector({ 
  label, 
  value, 
  onChange 
}: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get all icon names from both lucide-react and @tabler/icons-react
  const iconNames = useMemo(() => {
    const excludedLucideNames = new Set(['createLucideIcon', 'Icon', 'LucideProps', 'default', 'lucideReact']);
    const excludedTablerNames = new Set(['Icon', 'createReactComponent', 'default']);
    
    const icons: Array<{ name: string; library: 'lucide' | 'tabler'; displayName: string }> = [];
    
    // Get Lucide icons
    const lucideKeys = Object.keys(LucideIcons);
    lucideKeys.forEach(name => {
      if (excludedLucideNames.has(name)) return;
      if (name.length === 0 || name[0] !== name[0].toUpperCase()) return;
      if (name.endsWith('Icon') && lucideKeys.includes(name.slice(0, -4))) return;
      
      const Icon = (LucideIcons as Record<string, unknown>)[name];
      if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null && ('render' in Icon || '$$typeof' in Icon))) {
        icons.push({ name: `lucide:${name}`, library: 'lucide', displayName: name });
      }
    });
    
    // Get Tabler icons
    const tablerKeys = Object.keys(TablerIcons);
    tablerKeys.forEach(name => {
      if (excludedTablerNames.has(name)) return;
      if (name.length === 0 || !name.startsWith('Icon')) return;
      
      const Icon = (TablerIcons as Record<string, unknown>)[name];
      if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null && ('render' in Icon || '$$typeof' in Icon))) {
        // Remove "Icon" prefix for display name
        const displayName = name.startsWith('Icon') ? name.slice(4) : name;
        icons.push({ name: `tabler:${name}`, library: 'tabler', displayName });
      }
    });
    
    // Sort by display name
    return icons.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, []);

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    if (!searchQuery) return iconNames;
    const query = searchQuery.toLowerCase();
    return iconNames.filter(icon => 
      icon.displayName.toLowerCase().includes(query) || 
      icon.name.toLowerCase().includes(query)
    );
  }, [iconNames, searchQuery]);


  const handleSelectIcon = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Always reset search when dialog state changes
    setSearchQuery("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
          >
            {value ? (
              <>
                <SelectedIcon iconName={value} className="mr-2 h-4 w-4" />
                {value.includes(':') ? value.split(':')[1] : value}
              </>
            ) : (
              "Select an icon..."
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Icon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {/* Icons Grid */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-6 gap-2">
                  {filteredIcons.map((icon) => {
                    const iconLib = icon.library === 'lucide' ? LucideIcons : TablerIcons;
                    const iconKey = icon.name.split(':')[1]; // Extract icon name after library prefix
                    const IconComponent = (iconLib as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconKey];
                    if (!IconComponent) return null;
                    
                    const isSelected = value === icon.name;
                    
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => handleSelectIcon(icon.name)}
                        className={`
                          flex flex-col items-center justify-center gap-1 p-3 rounded-md border
                          transition-colors hover:bg-accent
                          ${isSelected ? 'bg-accent border-primary' : 'border-border'}
                        `}
                        title={`${icon.displayName} (${icon.library})`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-xs truncate w-full text-center">{icon.displayName}</span>
                        <span className="text-[10px] text-muted-foreground">{icon.library}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  {searchQuery ? (
                    <>No icons found matching &quot;{searchQuery}&quot;</>
                  ) : iconNames.length === 0 ? (
                    <>No icons available</>
                  ) : (
                    <>Loading icons...</>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

