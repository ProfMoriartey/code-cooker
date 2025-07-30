// src/lib/types.ts

// Define QrCodeType as an enum so its values are available at runtime
export enum QrCodeType {
  URL = "url",
  TEXT = "text",
  WIFI = "wifi",
  EMAIL = "email",
  PHONE = "phone",
  SMS = "sms", // Added SMS type
  // Add other QR code types as needed
}

export type QRCode = {
  id: number;
  data: string;
  type: QrCodeType;
  title: string | null;
  foregroundColor: string;
  backgroundColor: string;
  createdAt: Date;
  // If you have an 'updatedAt' field in your schema, add it here:
  // updatedAt?: Date;
};
