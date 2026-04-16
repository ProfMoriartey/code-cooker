// src/components/dashboard/qr-code-generator-form.tsx
"use client";

import { useFormStatus } from "react-dom";
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
import { QrCodeType, type MultiPageSet } from "~/lib/types"; // Imported MultiPageSet
import { ColorPickerInput } from "../ui/color-picker-input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-6 w-full py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
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
  multiPageSets: MultiPageSet[]; // New prop for the link-in-bio sets
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
  multiPageSets = [], // Default to empty array if not provided yet
}: QrCodeGeneratorFormProps) {
  const [isDynamic, setIsDynamic] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedMultiPageId, setSelectedMultiPageId] = useState<string>("none"); // State for dropdown

  // Handle Target URL input directly
  const handleTargetUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetUrl(e.target.value);
    setSelectedMultiPageId("none"); // Reset dropdown if user types manually
  };

  // Handle Multi-Page Set selection
  const handleMultiPageSelect = (value: string) => {
    setSelectedMultiPageId(value);
    
    if (value === "none") {
      setTargetUrl("");
      return;
    }

    const selectedSet = multiPageSets.find((set) => set.id.toString() === value);
    if (selectedSet) {
      // Use the environment variable, fallback to window.location.origin if it is missing
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
      
      // Ensure there are no double slashes by cleaning the appUrl
      const cleanAppUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
      
      setTargetUrl(`${cleanAppUrl}/m/${selectedSet.shortCode}`);
    }
  };

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
    <form action={handleSubmit} className="w-full max-w-2xl space-y-6 rounded-lg">
      <input type="hidden" name="isDynamic" value={isDynamic ? "true" : "false"} />
      {isDynamic && <input type="hidden" name="targetUrl" value={targetUrl} />}

      {/* QR Code Type Selection */}
      <Card className="shadow-sm border-gray-200">
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
              <Label htmlFor="static-qr" className="cursor-pointer text-base font-medium">
                Static QR Code
                <p className="text-sm text-gray-500">Content is fixed after creation.</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dynamic" id="dynamic-qr" />
              <Label htmlFor="dynamic-qr" className="cursor-pointer text-base font-medium">
                Dynamic QR Code
                <p className="text-sm text-gray-500">Change content anytime, track scans.</p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* QR Code Details */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>QR Code Details</CardTitle>
          <CardDescription>
            Provide a title and the content for your QR code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-1 block font-semibold text-gray-700">
              QR Code Title (Optional)
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., My Website Link or Event Promo"
              value={qrTitle}
              onChange={(e) => setQrTitle(e.target.value)}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {!isDynamic ? (
            <>
              <div>
                <Label htmlFor="data" className="mb-1 block font-semibold text-gray-700">
                  Content for QR Code
                </Label>
                <Textarea
                  id="data"
                  name="data"
                  placeholder={getPlaceholderText()}
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  This content will be directly embedded into the QR code.
                </p>
              </div>
              <div>
                <Label htmlFor="type" className="mb-1 block font-semibold text-gray-700">
                  QR Code Type
                </Label>
                <Select
                  value={qrType}
                  onValueChange={(value) => setQrType(value as QrCodeType)}
                  name="type"
                >
                  <SelectTrigger className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(QrCodeType).map((typeOption) => (
                      <SelectItem key={typeOption} value={typeOption}>
                        {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-sm text-gray-500">
                  Helps scanners understand the QR code&apos;s purpose.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* NEW: Multi-Page Set Selector */}
              {multiPageSets.length > 0 && (
                <div className="mb-4 p-4 border rounded-lg bg-gray-50 border-gray-200">
                  <Label htmlFor="multiPageSelect" className="mb-1 block font-semibold text-indigo-700">
                    Use a Multi-Page Link-in-Bio?
                  </Label>
                  <Select value={selectedMultiPageId} onValueChange={handleMultiPageSelect}>
                    <SelectTrigger id="multiPageSelect" className="w-full bg-white border-gray-300 focus:ring-indigo-500">
                      <SelectValue placeholder="Select a saved Multi-Page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Custom Target URL --</SelectItem>
                      {multiPageSets.map((set) => (
                        <SelectItem key={set.id} value={set.id.toString()}>
                          {set.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-gray-500">
                    Selecting a page will automatically fill the Target URL below.
                  </p>
                </div>
              )}

              {/* Dynamic QR Code Target URL */}
              <div>
                <Label htmlFor="targetUrl" className="mb-1 block font-semibold text-gray-700">
                  Target URL
                </Label>
                <Input
                  id="targetUrl"
                  name="targetUrl"
                  type="text"
                  placeholder="e.g., https://yourwebsite.com/promo-page"
                  value={targetUrl}
                  onChange={handleTargetUrlChange}
                  className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Users will be redirected to this URL. You can change it anytime.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* QR Code Appearance */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the colors of your QR code.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="flex-1">
              <Label htmlFor="fg-color-picker" className="mb-1 block font-semibold text-gray-700">
                Foreground Color
              </Label>
              <ColorPickerInput
                color={foregroundColor}
                onChange={setForegroundColor}
                name="foregroundColor"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="bg-color-picker" className="mb-1 block font-semibold text-gray-700">
                Background Color
              </Label>
              <ColorPickerInput
                color={backgroundColor}
                onChange={setBackgroundColor}
                name="backgroundColor"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <SubmitButton />
    </form>
  );
}