// src/components/ui/color-picker-input.tsx
"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";

import { cn } from "~/lib/utils"; // Assuming you have this utility for tailwind-merge/clsx
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input"; // Import Input for hex code display

interface ColorPickerInputProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  name?: string; // Added 'name' prop
}

export function ColorPickerInput({
  color,
  onChange,
  className,
  name, // Destructure 'name' prop
}: ColorPickerInputProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  // Function to handle changes from the HexColorPicker
  const handlePickerChange = (newColor: string) => {
    onChange(newColor);
  };

  // Function to handle changes from the text input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    // Basic validation: update if it's a valid hex string or empty (for user input)
    // You might want more robust validation here.
    if (/^#?([0-9A-Fa-f]{3}){1,2}$/.test(newColor) || newColor === "") {
      onChange(newColor);
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-10 rounded-md border-2 p-0"
            style={{ backgroundColor: color }}
            aria-label="Pick color"
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <HexColorPicker color={color} onChange={handlePickerChange} />
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        value={color}
        onChange={handleInputChange}
        className="w-24"
        placeholder="#RRGGBB"
        name={name} // Pass the 'name' prop to the Input component
      />
    </div>
  );
}
