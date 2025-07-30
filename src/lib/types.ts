// src/lib/types.ts

// Define QrCodeType as an enum so its values are available at runtime
export enum QrCodeType {
  URL = "url",
  TEXT = "text",
  WIFI = "wifi",
  EMAIL = "email",
  PHONE = "phone",
  SMS = "sms",
  // Add other QR code types as needed
}

export type QRCode = {
  id: number;
  data: string; // For static, this is the content; for dynamic, it's the shortCode
  type: QrCodeType;
  title: string | null;
  foregroundColor: string;
  backgroundColor: string;
  createdAt: Date;
  // If you have an 'updatedAt' field in your schema, add it here:
  // updatedAt?: Date;

  // New fields for dynamic QR codes
  isDynamic: boolean;
  shortCode: string | null; // The unique short identifier for dynamic QR codes
  targetUrl: string | null; // The URL the dynamic QR code redirects to
  scanCount: number; // Number of times the dynamic QR code has been scanned
};
