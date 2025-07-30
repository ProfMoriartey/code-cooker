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
import { QrCodeType, type QRCode } from "~/lib/types";
import { ColorPickerInput } from "../ui/color-picker-input";

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
  const [content, setContent] = useState(qrCode.data); // For static QR codes
  const [type, setType] = useState<QrCodeType>(qrCode.type); // For static QR codes
  const [targetUrl, setTargetUrl] = useState(qrCode.targetUrl ?? ""); // For dynamic QR codes
  const [foregroundColor, setForegroundColor] = useState(
    qrCode.foregroundColor ?? "#000000",
  );
  const [backgroundColor, setBackgroundColor] = useState(
    qrCode.backgroundColor ?? "#FFFFFF",
  );

  // Effect to update form fields if the qrCode prop changes
  useEffect(() => {
    setTitle(qrCode.title ?? "");
    setContent(qrCode.data);
    setType(qrCode.type);
    setTargetUrl(qrCode.targetUrl ?? ""); // Initialize targetUrl
    setForegroundColor(qrCode.foregroundColor ?? "#000000");
    setBackgroundColor(qrCode.backgroundColor ?? "#FFFFFF");
  }, [qrCode]);

  // Determine the data to be displayed in the QR code preview
  const qrPreviewData = qrCode.isDynamic
    ? `${window.location.origin}/qr/${qrCode.shortCode}`
    : content;

  // Determine the type for the QR code preview
  const qrPreviewType = qrCode.isDynamic ? QrCodeType.URL : type;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQrCode: QRCode = {
      ...qrCode, // Keep existing ID and other properties
      title,
      // Conditional data and type based on isDynamic
      data: qrCode.isDynamic ? (qrCode.shortCode ?? "") : content, // For dynamic, 'data' is the shortCode
      type: qrCode.isDynamic ? QrCodeType.URL : type, // For dynamic, 'type' is always URL
      targetUrl: qrCode.isDynamic ? targetUrl : null, // Only set targetUrl if dynamic
      foregroundColor,
      backgroundColor,
      // isDynamic, shortCode, and scanCount are already part of qrCode
      // and should not be changed by the form directly, except targetUrl
    };
    onSave(updatedQrCode); // Call the onSave prop with the updated QR code
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6 p-4">
      {/* QR Code Preview */}
      <div className="flex flex-col items-center gap-4">
        <h4 className="text-xl font-semibold">QR Code Preview</h4>
        <QRCodeDisplay
          initialData={qrPreviewData} // Use dynamic or static content
          initialType={qrPreviewType} // Use dynamic or static type
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

      {/* Conditional Inputs for Dynamic vs. Static */}
      {qrCode.isDynamic ? (
        // Dynamic QR Code fields
        <div>
          <Label htmlFor="targetUrl">Target URL</Label>
          <Input
            id="targetUrl"
            type="url" // Use type="url" for better validation
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="e.g., https://yourwebsite.com/new-promo"
            required
            className="mt-1"
          />
          <p className="mt-2 text-sm text-gray-500">
            This QR code redirects to:{" "}
            <span className="truncate font-medium text-blue-600">
              {qrCode.shortCode
                ? `${window.location.origin}/qr/${qrCode.shortCode}`
                : "N/A"}
            </span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Total Scans: <span className="font-medium">{qrCode.scanCount}</span>
          </p>
        </div>
      ) : (
        // Static QR Code fields
        <>
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
                {Object.values(QrCodeType).map((qrTypeOption) => (
                  <SelectItem key={qrTypeOption} value={qrTypeOption}>
                    {qrTypeOption.charAt(0).toUpperCase() +
                      qrTypeOption.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Foreground Color Input */}
      <div>
        <Label htmlFor="foregroundColor">Foreground Color</Label>
        <ColorPickerInput
          color={foregroundColor}
          onChange={setForegroundColor}
          className="mt-1"
        />
      </div>

      {/* Background Color Input */}
      <div>
        <Label htmlFor="backgroundColor">Background Color</Label>
        <ColorPickerInput
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
