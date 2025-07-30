// src/components/qr-code-display.tsx
"use client";

import { useRef, useEffect, useCallback } from "react";
import { useQRCode } from "next-qrcode";
import { Button } from "~/components/ui/button";
import type { QrCodeType } from "~/lib/types"; // Ensure QrCodeType is imported

interface QRCodeDisplayProps {
  initialData: string;
  initialType: QrCodeType;
  size?: number; // Optional size prop
  foregroundColor?: string; // New prop for QR code color (hex string, e.g., "#000000" for black)
  backgroundColor?: string; // New prop for QR code background color (hex string, e.g., "#FFFFFF" for white)
}

export function QRCodeDisplay({
  initialData,
  initialType, // Keep this, though not used directly for QR rendering, it's part of the `initial` state concept.
  size = 200, // Default size
  foregroundColor = "#000000", // Default to black if not provided
  backgroundColor = "#FFFFFF", // Default to white if not provided
}: QRCodeDisplayProps) {
  const { Canvas } = useQRCode();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const actualCanvas = containerRef.current.querySelector("canvas");
      if (actualCanvas) {
        canvasRef.current = actualCanvas;
      } else {
        console.error("Canvas element not found within the container.");
      }
    }
  }, [initialData, initialType, size, foregroundColor, backgroundColor]); // Add colors to dependency array

  const handleDownload = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    } else {
      console.log("Canvas reference not available for download.");
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          void navigator.clipboard
            .write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ])
            .then(() => {
              console.log("QR Code copied to clipboard!");
            })
            .catch((err) => {
              console.error("Failed to copy QR Code to clipboard:", err);
            });
        }
      }, "image/png");
    } else {
      console.log("Canvas reference not available for copy.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <div ref={containerRef} className="rounded-lg border p-2 shadow-md">
        {initialData ? (
          <Canvas
            text={initialData}
            options={{
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 9,
              width: size,
              color: {
                dark: foregroundColor, // Use the prop for foreground color
                light: backgroundColor, // Use the prop for background color
              },
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-lg bg-gray-200"
            style={{ width: size, height: size }}
          >
            <p className="text-gray-500">No QR Code</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-4">
        <Button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Download PNG
        </Button>
        <Button onClick={handleCopy} className="bg-gray-500 hover:bg-gray-600">
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
}
