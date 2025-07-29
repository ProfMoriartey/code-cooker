// src/lib/types.ts

// Define the enum for QR code types as a const array for literal types
export const qrCodeTypeEnum = ["text", "url", "email", "phone", "sms", "wifi"] as const;

// Infer the TypeScript type from the enum values
export type QrCodeType = (typeof qrCodeTypeEnum)[number];

// Type for a QR code record fetched from the database
// This interface should match the structure of your 'qrCodes' table in src/server/db/schema.ts
export interface QRCode {
  id: number;
  userId: string;
  data: string; // This property holds the actual QR code content (URL, text, etc.)
  type: QrCodeType; // Corresponds to the qrCodeTypeEnum values
  title: string | null; // Optional title for the QR code
  createdAt: Date;
  updatedAt: Date;
}
