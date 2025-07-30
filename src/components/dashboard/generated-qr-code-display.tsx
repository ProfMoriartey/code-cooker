// src/components/dashboard/generated-qr-code-display.tsx
"use client";

import { QRCodeDisplay } from "~/components/qr-code-display"; // Assuming QRCodeDisplay exists
import { type QrCodeType } from "~/lib/types"; // Import QrCodeType

interface GeneratedQrCodeDisplayProps {
  generatedQrData: string;
  generatedQrType: QrCodeType;
  foregroundColor?: string; // Add this new prop
  backgroundColor?: string; // Add this new prop
}

export default function GeneratedQrCodeDisplay({
  generatedQrData,
  generatedQrType,
  foregroundColor, // Destructure the prop
  backgroundColor, // Destructure the prop
}: GeneratedQrCodeDisplayProps) {
  if (!generatedQrData) {
    return null; // Don't render anything if no QR code has been generated yet
  }

  return (
    <div className="mt-8 w-full rounded-lg border bg-gray-50 p-4 shadow-inner">
      <h3 className="mb-4 text-center text-xl font-semibold">
        Newly Generated QR Code:
      </h3>
      <QRCodeDisplay
        initialData={generatedQrData}
        initialType={generatedQrType}
        foregroundColor={foregroundColor} // Pass to QRCodeDisplay
        backgroundColor={backgroundColor} // Pass to QRCodeDisplay
      />
    </div>
  );
}
