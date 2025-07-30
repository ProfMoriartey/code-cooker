// src/components/dashboard/qr-code-generator-form.tsx
"use client";

import { useFormStatus } from "react-dom"; // For pending state of form
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { QrCodeType } from "~/lib/types";
import { ColorPickerInput } from "../ui/color-picker-input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useState } from "react";

// A helper component for the submit button to show loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-4 w-full">
      {pending ? "Generating..." : "Generate & Save QR Code"}
    </Button>
  );
}

interface QrCodeGeneratorFormProps {
  qrContent: string;
  setQrContent: (content: string) => void;
  qrTitle: string;
  setQrTitle: (title: string) => void;
  qrType: QrCodeType;
  setQrType: (type: QrCodeType) => void;
  handleSubmit: (formData: FormData) => Promise<void>;
  feedbackMessage: string | null;
  isError: boolean;
  foregroundColor: string;
  setForegroundColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

export default function QrCodeGeneratorForm({
  qrContent,
  setQrContent,
  qrTitle,
  setQrTitle,
  qrType,
  setQrType,
  handleSubmit,
  foregroundColor,
  setForegroundColor,
  backgroundColor,
  setBackgroundColor,
}: QrCodeGeneratorFormProps) {
  const [isDynamic, setIsDynamic] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");

  // Function to handle target URL input change - no automatic prepending here
  const handleTargetUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetUrl(e.target.value); // Just update the state with the raw input
  };

  return (
    <form action={handleSubmit} className="w-full space-y-4">
      {/* Hidden inputs for dynamic properties, will be included in FormData */}
      <input
        type="hidden"
        name="isDynamic"
        value={isDynamic ? "true" : "false"}
      />
      {isDynamic && <input type="hidden" name="targetUrl" value={targetUrl} />}

      {/* QR Code Type Selection (Static vs. Dynamic) */}
      <div>
        <Label>QR Code Type</Label>
        <RadioGroup
          defaultValue="static"
          className="mt-2 flex space-x-4"
          onValueChange={(value) => setIsDynamic(value === "dynamic")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="static" id="static-qr" />
            <Label htmlFor="static-qr">Static QR Code</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dynamic" id="dynamic-qr" />
            <Label htmlFor="dynamic-qr">Dynamic QR Code</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Title Input (common for both types) */}
      <div>
        <Label htmlFor="title">QR Code Title (Optional)</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="e.g., My Website Link"
          value={qrTitle}
          onChange={(e) => setQrTitle(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Conditional Inputs based on isDynamic */}
      {!isDynamic ? (
        <>
          {/* Static QR Code Content */}
          <div>
            <Label htmlFor="data">Content for QR Code</Label>
            <Textarea
              id="data"
              name="data"
              placeholder={
                qrType === "email"
                  ? "email@example.com?subject=Hello&body=Message"
                  : qrType === "phone"
                    ? "1234567890"
                    : qrType === "sms"
                      ? "1234567890?body=Hello"
                      : qrType === "wifi"
                        ? "SSID,Type,Password,Hidden(true/false)"
                        : "Enter your content here"
              }
              value={qrContent}
              onChange={(e) => setQrContent(e.target.value)}
              className="mt-1 min-h-[100px]"
              required
            />
          </div>
          {/* Static QR Code Type */}
          <div>
            <Label htmlFor="type">QR Code Type</Label>
            <Select
              value={qrType}
              onValueChange={(value) => setQrType(value as QrCodeType)}
              name="type"
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QrCodeType).map((typeOption) => (
                  <SelectItem key={typeOption} value={typeOption}>
                    {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      ) : (
        <>
          {/* Dynamic QR Code Target URL */}
          <div>
            <Label htmlFor="targetUrl">Target URL</Label>
            <Input
              id="targetUrl"
              name="targetUrl"
              type="text" // Changed type from "url" to "text"
              placeholder="e.g., yourwebsite.com/promo"
              value={targetUrl}
              onChange={handleTargetUrlChange}
              className="mt-1"
              required
            />
          </div>
        </>
      )}

      {/* Color Inputs (common for both types) */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="fg-color-picker">Foreground Color</Label>
          <ColorPickerInput
            color={foregroundColor}
            onChange={setForegroundColor}
            className="mt-1"
            name="foregroundColor"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="bg-color-picker">Background Color</Label>
          <ColorPickerInput
            color={backgroundColor}
            onChange={setBackgroundColor}
            className="mt-1"
            name="backgroundColor"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
