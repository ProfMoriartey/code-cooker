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
}: QrCodeGeneratorFormProps) {
  return (
    <>
      {feedbackMessage && (
        <div
          className={`mt-4 w-full rounded-md p-3 text-center ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {feedbackMessage}
        </div>
      )}

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
            placeholder="Enter text, a URL (e.g., https://example.com), email, phone number, etc."
            value={qrContent}
            onChange={(e) => setQrContent(e.target.value)}
            className="mt-1 min-h-[100px]"
          />
        </div>
        <div>
          <Label htmlFor="type">QR Code Type</Label>
          <Select
            value={qrType}
            onValueChange={(value) => setQrType(value as QrCodeType)} // Fix applied here
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
        <SubmitButton />
      </form>
    </>
  );
}
