// src/lib/qr-code-formatter.ts
import { QrCodeType } from "~/lib/types"; // Ensure this import path is correct

/**
 * Formats raw QR code content based on its type.
 * @param content The raw input content for the QR code.
 * @param qrType The type of QR code (e.g., "url", "email", "wifi").
 * @returns The formatted QR code data string, or null if there's a formatting error.
 */
export function formatQrCodeData(
  content: string,
  qrType: QrCodeType,
): { formattedData: string | null; error: string | null } {
  if (!content) {
    return { formattedData: null, error: "QR code content cannot be empty." };
  }

  let formattedData = content;
  let error: string | null = null;

  switch (qrType) {
    case QrCodeType.EMAIL:
      const emailParts = content.split("?");
      const emailAddress = emailParts[0];
      const emailParams = emailParts.length > 1 ? `?${emailParts[1]}` : "";
      formattedData = `mailto:${emailAddress}${emailParams}`;
      break;

    case QrCodeType.PHONE:
      formattedData = `tel:${content.replace(/\D/g, "")}`;
      break;

    case QrCodeType.SMS:
      const smsIndex = content.indexOf("?");
      const smsNumber = content
        .substring(0, smsIndex === -1 ? content.length : smsIndex)
        .replace(/\D/g, "");
      const smsMessage =
        smsIndex !== -1 ? `?${content.substring(smsIndex + 1)}` : "";
      formattedData = `sms:${smsNumber}${smsMessage}`;
      break;

    case QrCodeType.WIFI:
      const wifiParts = content.split(",");
      if (wifiParts.length >= 3) {
        const ssid = wifiParts[0]?.trim() ?? "";
        const wifiType = wifiParts[1]?.trim() ?? "";
        const password = wifiParts[2]?.trim() ?? "";
        const hidden = wifiParts[3]?.trim() === "true" ? "true" : "false";
        formattedData = `WIFI:S:${ssid};T:${wifiType};P:${password};H:${hidden};`;
      } else {
        error =
          "For Wi-Fi, provide: SSID,Type (WEP/WPA/blank),Password,Hidden(true/false)";
      }
      break;

    case QrCodeType.URL:
      if (!content.startsWith("http://") && !content.startsWith("https://")) {
        formattedData = `https://${content}`;
      }
      break;

    case QrCodeType.TEXT:
    default:
      break;
  }

  return { formattedData, error };
}