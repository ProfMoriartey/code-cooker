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
import { QrCodeType } from "~/lib/types"; // Ensure this path is correct for your QrCodeType enum
import { ColorPickerInput } from "../ui/color-picker-input"; // Ensure this path is correct
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"; // Import Card components

// A helper component for the submit button to show loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-6 w-full py-3 text-lg font-semibold"
    >
      {pending ? "Generating QR Code..." : "Generate & Save QR Code"}
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

  // Helper function to get placeholder text based on QR type
  const getPlaceholderText = () => {
    switch (qrType) {
      case QrCodeType.EMAIL:
        return "email@example.com?subject=Hello&body=Message";
      case QrCodeType.PHONE:
        return "e.g., +1234567890";
      case QrCodeType.SMS:
        return "e.g., +1234567890?body=Hello there!";
      case QrCodeType.WIFI:
        return "e.g., SSID,WPA/WEP/None,Password,true/false(Hidden)";
      case QrCodeType.TEXT:
        return "Enter any plain text here...";
      case QrCodeType.URL:
        return "e.g., https://yourwebsite.com";
      default:
        return "Enter your content here";
    }
  };

  return (
    <form
      action={handleSubmit}
      className="w-full max-w-2xl space-y-6 rounded-lg"
    >
      {/* Hidden inputs for dynamic properties, will be included in FormData */}
      <input
        type="hidden"
        name="isDynamic"
        value={isDynamic ? "true" : "false"}
      />
      {isDynamic && <input type="hidden" name="targetUrl" value={targetUrl} />}

      {/* QR Code Type Selection (Static vs. Dynamic) */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Choose QR Code Type</CardTitle>
          <CardDescription>
            Select whether you need a static or dynamic QR code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue="static"
            className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8"
            onValueChange={(value) => setIsDynamic(value === "dynamic")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="static" id="static-qr" />
              <Label
                htmlFor="static-qr"
                className="cursor-pointer text-base font-medium"
              >
                Static QR Code
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Content is fixed after creation.
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dynamic" id="dynamic-qr" />
              <Label
                htmlFor="dynamic-qr"
                className="cursor-pointer text-base font-medium"
              >
                Dynamic QR Code
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Change content anytime, track scans.
                </p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* QR Code Details */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>QR Code Details</CardTitle>
          <CardDescription>
            Provide a title and the content for your QR code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title Input (common for both types) */}
          <div>
            <Label htmlFor="title" className="mb-1 block">
              QR Code Title (Optional)
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., My Website Link or Event Promo"
              value={qrTitle}
              onChange={(e) => setQrTitle(e.target.value)}
            />
          </div>

          {/* Conditional Inputs based on isDynamic */}
          {!isDynamic ? (
            <>
              {/* Static QR Code Content */}
              <div>
                <Label htmlFor="data" className="mb-1 block">
                  Content for QR Code
                </Label>
                <Textarea
                  id="data"
                  name="data"
                  placeholder={getPlaceholderText()}
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                  className="min-h-[120px]"
                  required
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This content will be directly embedded into the QR code.
                </p>
              </div>
              {/* Static QR Code Type */}
              <div>
                <Label htmlFor="type" className="mb-1 block">
                  QR Code Type
                </Label>
                <Select
                  value={qrType}
                  onValueChange={(value) => setQrType(value as QrCodeType)}
                  name="type"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(QrCodeType).map((typeOption) => (
                      <SelectItem key={typeOption} value={typeOption}>
                        {typeOption.charAt(0).toUpperCase() +
                          typeOption.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Helps scanners understand the QR code&aposs purpose.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Dynamic QR Code Target URL */}
              <div>
                <Label htmlFor="targetUrl" className="mb-1 block">
                  Target URL
                </Label>
                <Input
                  id="targetUrl"
                  name="targetUrl"
                  type="text" // Changed type from "url" to "text" to allow more flexible input
                  placeholder="e.g., https://yourwebsite.com/promo-page"
                  value={targetUrl}
                  onChange={handleTargetUrlChange}
                  required
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Users will be redirected to this URL. You can change it
                  anytime.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* QR Code Appearance */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the colors of your QR code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="flex-1">
              <Label htmlFor="fg-color-picker" className="mb-1 block">
                Foreground Color
              </Label>
              <ColorPickerInput
                color={foregroundColor}
                onChange={setForegroundColor}
                name="foregroundColor"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The color of the QR code modules.
              </p>
            </div>
            <div className="flex-1">
              <Label htmlFor="bg-color-picker" className="mb-1 block">
                Background Color
              </Label>
              <ColorPickerInput
                color={backgroundColor}
                onChange={setBackgroundColor}
                name="backgroundColor"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The color behind the QR code modules.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubmitButton />
    </form>
  );
}
