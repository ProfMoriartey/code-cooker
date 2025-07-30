// src/components/dashboard/qr-code-edit-form.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { QRCodeDisplay } from "~/components/qr-code-display";
import { QrCodeType, type QRCode } from "~/lib/types"; // Import QrCodeType enum
import { ColorPickerInput } from "../ui/color-picker-input";
// Import QrCodeType enum

interface QrCodeEditFormProps {
  qrCode: QRCode;
  onSave: (updatedQrCode: QRCode) => void;
  onCancel: () => void;
}

export default function QrCodeEditForm({
  qrCode,
  onSave,
  onCancel,
}: QrCodeEditFormProps) {
  // State to manage the form fields, initialized with the current QR code data
  const [title, setTitle] = useState(qrCode.title ?? "");
  const [content, setContent] = useState(qrCode.data);
  const [type, setType] = useState<QrCodeType>(qrCode.type);
  const [foregroundColor, setForegroundColor] = useState(
    qrCode.foregroundColor ?? "#000000",
  );
  const [backgroundColor, setBackgroundColor] = useState(
    qrCode.backgroundColor ?? "#FFFFFF",
  );

  // Effect to update form fields if the qrCode prop changes (e.g., if a different QR code is selected for edit)
  useEffect(() => {
    setTitle(qrCode.title ?? "");
    setContent(qrCode.data);
    setType(qrCode.type);
    setForegroundColor(qrCode.foregroundColor ?? "#000000");
    setBackgroundColor(qrCode.backgroundColor ?? "#FFFFFF");
  }, [qrCode]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQrCode: QRCode = {
      ...qrCode, // Keep existing ID and other properties
      title,
      data: content,
      type,
      foregroundColor,
      backgroundColor,
    };
    onSave(updatedQrCode); // Call the onSave prop with the updated QR code
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6 p-4">
      {" "}
      {/* Added max-w-xl mx-auto */}
      {/* QR Code Preview */}
      <div className="flex flex-col items-center gap-4">
        <h4 className="text-xl font-semibold">Live Preview</h4>
        <QRCodeDisplay
          initialData={content}
          initialType={type}
          size={200}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
        />
      </div>
      {/* Title Input */}
      <div>
        <Label htmlFor="qrTitle">QR Code Title</Label>
        <Input
          id="qrTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your QR code"
          className="mt-1"
        />
      </div>
      {/* Content Input */}
      <div>
        <Label htmlFor="qrContent">QR Code Content</Label>
        <Input
          id="qrContent"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter content for your QR code"
          required
          className="mt-1"
        />
      </div>
      {/* Type Select */}
      <div>
        <Label htmlFor="qrType">QR Code Type</Label>
        <Select
          value={type}
          onValueChange={(value: QrCodeType) => setType(value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Select QR Code Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(QrCodeType).map((qrType) => (
              <SelectItem key={qrType} value={qrType}>
                {qrType.charAt(0).toUpperCase() + qrType.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Foreground Color Input */}
      <div>
        <Label htmlFor="foregroundColor">Foreground Color</Label>
        <ColorPickerInput // Using ColorPickerInput
          color={foregroundColor}
          onChange={setForegroundColor}
          className="mt-1"
        />
      </div>
      {/* Background Color Input */}
      <div>
        <Label htmlFor="backgroundColor">Background Color</Label>
        <ColorPickerInput // Using ColorPickerInput
          color={backgroundColor}
          onChange={setBackgroundColor}
          className="mt-1"
        />
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
