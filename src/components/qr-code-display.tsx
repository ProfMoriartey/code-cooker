// src/components/qr-code-display.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQRCode } from "next-qrcode";
import { Button } from "./ui/button"; // Assuming shadcn button is available
import { Input } from "./ui/input"; // Assuming shadcn input is available

interface QRCodeDisplayProps {
  initialData: string;
  initialType?: "text" | "url" | "email" | "phone" | "sms" | "wifi"; // Match your schema enum
  size?: number;
  fgColor?: string;
  bgColor?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  initialData,
  initialType = "text",
  size = 256,
  fgColor = "#000000",
  bgColor = "#FFFFFF",
}) => {
  const { Canvas } = useQRCode();
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref for the actual canvas DOM element
  const containerRef = useRef<HTMLDivElement | null>(null); // Ref for the container div

  // Effect to find the actual canvas element after initial render
  useEffect(() => {
    if (containerRef.current) {
      // Find the canvas element inside the container div
      const canvasElement = containerRef.current.querySelector("canvas");
      if (canvasElement) {
        canvasRef.current = canvasElement;
      }
    }
  }, [initialData, initialType, size, fgColor, bgColor]); // Re-run if QR code properties change

  // Function to format data based on type (for better QR encoding)
  const formatData = useCallback((data: string, type: string) => {
    switch (type) {
      case "url":
        return data.startsWith("http") || data.startsWith("https")
          ? data
          : `https://${data}`;
      case "email":
        return `mailto:${data}`;
      case "phone":
        return `tel:${data.replace(/\D/g, "")}`; // Remove non-digits
      case "sms":
        const questionMarkIndex = data.indexOf("?");
        const smsNumber =
          questionMarkIndex !== -1
            ? data.substring(0, questionMarkIndex).replace(/\D/g, "")
            : data.replace(/\D/g, "");
        const smsMessage =
          questionMarkIndex !== -1 ? data.substring(questionMarkIndex) : "";
        return `sms:${smsNumber}${smsMessage}`;
      case "wifi":
        // Format: WIFI:S:<SSID>;T:<WEP|WPA|nopass>;P:<PASSWORD>;H:<true|false>;
        // Data format expected: SSID,Password,SecurityType (e.g., "MyHomeNet,MyPassword,WPA")
        const parts = data.split(",");
        const ssid = parts[0] || "";
        const password = parts[1] || "";
        const security = parts[2] || "nopass"; // WEP, WPA, nopass
        return `WIFI:S:${ssid};T:${security};P:${password};;`;
      case "text":
      default:
        return data;
    }
  }, []);

  const qrCodeValue = formatData(initialData, initialType);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = canvasRef.current.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Canvas element not found for download.");
    }
  };

  const handleCopy = async () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          try {
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
            console.log("QR Code image copied to clipboard!");
          } catch (err) {
            console.error("Failed to copy image to clipboard:", err);
            console.log(
              "Failed to copy image to clipboard automatically. You can right-click/long-press the QR code and select 'Copy image' or 'Save image as...'",
            );
          }
        }
      });
    } else {
      console.error("Canvas element not found for copy.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {initialData ? (
        <>
          {/* Wrap the Canvas component in a div and attach ref to the div */}
          <div ref={containerRef} className="rounded-lg shadow-md">
            <Canvas
              text={qrCodeValue}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: size,
                color: {
                  dark: fgColor,
                  light: bgColor,
                },
              }}
              // Removed ref={canvasRef} directly from Canvas
            />
          </div>
          <div className="mt-6 flex space-x-4">
            <Button onClick={handleDownload}>Download PNG</Button>
            <Button onClick={handleCopy}>Copy Image</Button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Enter content to generate a QR code.</p>
      )}
    </div>
  );
};
