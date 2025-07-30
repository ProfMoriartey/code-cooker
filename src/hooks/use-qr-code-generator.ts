// src/hooks/use-qr-code-generator.ts
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { QrCodeType, type QRCode } from "~/lib/types";
import { formatQrCodeData } from "~/lib/qr-code-formatter";
import { createQrCode, createDynamicQrCode } from "~/app/actions"; // Import createDynamicQrCode

export function useQrCodeGenerator() {
  const { data: session, status } = useSession();

  const [qrContent, setQrContent] = useState("");
  const [qrType, setQrType] = useState<QrCodeType>(QrCodeType.TEXT);
  const [qrTitle, setQrTitle] = useState("");
  const [generatedQrData, setGeneratedQrData] = useState("");
  const [generatedQrType, setGeneratedQrType] = useState<QrCodeType>(QrCodeType.TEXT);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const [foregroundColor, setForegroundColor] = useState("#000000"); // Default black
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF"); // Default white

  const handleQrTypeChange = useCallback((value: string) => {
    setQrType(value as QrCodeType);
  }, []);

  const generateQrCode = useCallback(
    async (formData: FormData) => {
      setFeedbackMessage(null);
      setIsError(false);

      const title = (formData.get("title") as string) ?? null;
      const fgColor = formData.get("foregroundColor") as string;
      const bgColor = formData.get("backgroundColor") as string;
      const isDynamic = formData.get("isDynamic") === "true";

      if (status !== "authenticated" || !session?.user?.id) {
        setFeedbackMessage(
          "You must be signed in to generate and save QR codes.",
        );
        setIsError(true);
        return null;
      }

      let newQrCode: QRCode | null = null;
      let success = false;
      let errorMessage: string | null = null;

      if (isDynamic) {
        let targetUrl = formData.get("targetUrl") as string;

        if (!targetUrl) {
          setFeedbackMessage("Target URL cannot be empty for dynamic QR codes.");
          setIsError(true);
          return null;
        }

        // Prepend https:// if no protocol is present
        if (!/^https?:\/\//i.test(targetUrl)) {
          targetUrl = `https://${targetUrl}`;
        }

        try {
          const result = await createDynamicQrCode({
            title: title,
            targetUrl: targetUrl, // Use the formatted targetUrl
            foregroundColor: fgColor,
            backgroundColor: bgColor,
          });

          if (result.success && result.qrCode) {
            newQrCode = result.qrCode;
            success = true;
            setGeneratedQrData(`${window.location.origin}/qr/${newQrCode.shortCode}`);
            setGeneratedQrType(QrCodeType.URL);
            setQrContent("");
            setQrTitle("");
            setFeedbackMessage("Dynamic QR Code generated and saved successfully!");
          } else {
            errorMessage = result.error ?? "Failed to generate dynamic QR code.";
          }
        } catch (error) {
          console.error("Error creating dynamic QR code:", error);
          errorMessage = "An unexpected error occurred while creating dynamic QR code.";
        }

      } else {
        const content = formData.get("data") as string;
        const type = formData.get("type") as QrCodeType;

        if (!content) {
          setFeedbackMessage("QR code content cannot be empty.");
          setIsError(true);
          return null;
        }

        const { formattedData, error: formatError } = formatQrCodeData(
          content,
          type,
        );

        if (formatError) {
          setFeedbackMessage(formatError);
          setIsError(true);
          return null;
        }

        if (!formattedData) {
          setFeedbackMessage("Failed to format QR code data.");
          setIsError(true);
          return null;
        }

        try {
          const result = await createQrCode({
            data: formattedData,
            type: type,
            title: title,
            backgroundColor: bgColor,
            foregroundColor: fgColor,
          });

          if (result.success && result.qrCode) {
            newQrCode = result.qrCode;
            success = true;
            setGeneratedQrData(result.qrCode.data);
            setGeneratedQrType(result.qrCode.type);
            setQrContent("");
            setQrTitle("");
            setFeedbackMessage("Static QR Code generated and saved successfully!");
          } else {
            errorMessage = result.error ?? "Failed to generate static QR code.";
          }
        } catch (error) {
          console.error("Error creating static QR code:", error);
          errorMessage = "An unexpected error occurred while creating static QR code.";
        }
      }

      if (!success) {
        setFeedbackMessage(errorMessage);
        setIsError(true);
        return null;
      }

      return newQrCode;
    },
    [session?.user?.id, status],
  );

  return {
    qrContent,
    setQrContent,
    qrType,
    setQrType: handleQrTypeChange,
    qrTitle,
    setQrTitle,
    generatedQrData,
    generatedQrType,
    feedbackMessage,
    setFeedbackMessage,
    isError,
    setIsError,
    foregroundColor,
    setForegroundColor,
    backgroundColor,
    setBackgroundColor,
    generateQrCode,
  };
}
