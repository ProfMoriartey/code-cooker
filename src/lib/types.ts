// src/lib/types.ts
export type QrCodeType = "text" | "url" | "email" | "phone" | "sms" | "wifi";

export interface QRCode {
  id: number;
  userId: string;
  data: string;
  type: QrCodeType;
  title: string | null;
  createdAt: Date;
  foregroundColor: string; // Add this
  backgroundColor: string; // Add this
}

export const qrCodeTypeEnum = ["text", "url", "email", "phone", "sms", "wifi"] as const;