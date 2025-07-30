// src/hooks/use-qr-code-generator.ts
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { type QrCodeType, type QRCode } from "~/lib/types";
import { formatQrCodeData } from "~/lib/qr-code-formatter";
import { createQrCode } from "~/app/actions";

export function useQrCodeGenerator() {
  const { data: session, status } = useSession();

  const [qrContent, setQrContent] = useState("");
  const [qrType, setQrType] = useState<QrCodeType>("text");
  const [qrTitle, setQrTitle] = useState("");
  const [generatedQrData, setGeneratedQrData] = useState("");
  const [generatedQrType, setGeneratedQrType] = useState<QrCodeType>("text");
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

      const content = formData.get("data") as string;
      const title = (formData.get("title") as string) ?? null;

      if (!content) {
        setFeedbackMessage("QR code content cannot be empty.");
        setIsError(true);
        return null;
      }

      if (status !== "authenticated" || !session?.user?.id) {
        setFeedbackMessage(
          "You must be signed in to generate and save QR codes.",
        );
        setIsError(true);
        return null;
      }

      const { formattedData, error: formatError } = formatQrCodeData(
        content,
        qrType,
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
          type: qrType,
          title: title,
        });

        if (result.success && result.qrCode) {
          setGeneratedQrData(result.qrCode.data);
          setGeneratedQrType(result.qrCode.type);
          setQrContent("");
          setQrTitle("");
          setFeedbackMessage("QR Code generated and saved successfully!");
          return result.qrCode;
        } else {
          console.error(
            "Failed to generate QR code:",
            result.error,
            result.details,
          );
          setFeedbackMessage(
            result.error ?? "Failed to generate QR code. Please try again.",
          );
          setIsError(true);
          return null;
        }
      } catch (error: unknown) {
        console.error("Error generating QR code:", error);
        let message = "An unexpected error occurred.";
        if (error instanceof Error) {
          message = error.message;
        }
        setFeedbackMessage(message);
        setIsError(true);
        return null;
      }
    },
    [qrType, session?.user?.id, status],
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
    setFeedbackMessage, // Exporting the setter
    isError,
    setIsError, // Exporting the setter
    foregroundColor,
    setForegroundColor,
    backgroundColor,
    setBackgroundColor,
    generateQrCode,
  };
}