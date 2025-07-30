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
import { qrCodeTypeEnum, type QrCodeType } from "~/lib/types"; // Import from shared types
import { ColorPickerInput } from "../ui/color-picker-input";

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
  foregroundColor: string; // New prop for foreground color
  setForegroundColor: (color: string) => void; // Setter for foreground color
  backgroundColor: string; // New prop for background color
  setBackgroundColor: (color: string) => void; // Setter for background color
}

export default function QrCodeGeneratorForm({
  qrContent,
  setQrContent,
  qrTitle,
  setQrTitle,
  qrType,
  setQrType,
  handleSubmit,
  feedbackMessage,
  isError,
  foregroundColor, // Destructure new prop
  setForegroundColor, // Destructure new prop
  backgroundColor, // Destructure new prop
  setBackgroundColor, // Destructure new prop
}: QrCodeGeneratorFormProps) {
  // The feedbackMessage and isError are handled by FeedbackDisplay component in DashboardPage.
  // So, they are not rendered directly within this component's JSX anymore.

  return (
    <form action={handleSubmit} className="w-full space-y-4">
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
        />
      </div>
      <div>
        <Label htmlFor="type">QR Code Type</Label>
        <Select
          value={qrType}
          onValueChange={(value) => setQrType(value as QrCodeType)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {qrCodeTypeEnum.map((typeOption) => (
              <SelectItem key={typeOption} value={typeOption}>
                {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* New color inputs */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="fg-color-picker">Foreground Color</Label>
          <ColorPickerInput
            color={foregroundColor}
            onChange={setForegroundColor}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="bg-color-picker">Background Color</Label>
          <ColorPickerInput
            color={backgroundColor}
            onChange={setBackgroundColor}
            className="mt-1"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
