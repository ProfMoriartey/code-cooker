// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
// The following are no longer directly used here, but will be used in child components:
// import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
// import { Textarea } from "~/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
// import { useFormStatus } from "react-dom";

import { createQrCode, getUserQrCodes, deleteQrCode } from "~/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type QrCodeType, type QRCode, qrCodeTypeEnum } from "~/lib/types"; // qrCodeTypeEnum is now mostly for the Select component

// Import the new components
import QrCodeGeneratorForm from "~/components/dashboard/qr-code-generator-form";
import GeneratedQrCodeDisplay from "~/components/dashboard/generated-qr-code-display";
import SavedQrCodeList from "~/components/dashboard/saved-qr-code-list"; // New import
import { QRCodeDisplay } from "~/components/qr-code-display"; // This is for the QRCodeDisplay component used within SavedQrCodeList

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [qrContent, setQrContent] = useState("");
  const [qrType, setQrType] = useState<QrCodeType>("text");
  const [qrTitle, setQrTitle] = useState("");
  const [generatedQrData, setGeneratedQrData] = useState("");
  const [generatedQrType, setGeneratedQrType] = useState<QrCodeType>("text");
  const [userQrCodes, setUserQrCodes] = useState<QRCode[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Define a local handler for onValueChange to correctly type the value
  const handleQrTypeChange = useCallback((value: string) => {
    setQrType(value as QrCodeType);
  }, []);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setFeedbackMessage(null);
      setIsError(false);

      const content = formData.get("data") as string;
      const title = (formData.get("title") as string) ?? null;

      if (!content) {
        setFeedbackMessage("QR code content cannot be empty.");
        setIsError(true);
        return;
      }

      if (status !== "authenticated" || !session?.user?.id) {
        setFeedbackMessage(
          "You must be signed in to generate and save QR codes.",
        );
        setIsError(true);
        return;
      }

      let formattedData = content;

      switch (qrType) {
        case "email":
          const emailParts = content.split("?");
          const emailAddress = emailParts[0];
          const emailParams = emailParts.length > 1 ? `?${emailParts[1]}` : "";
          formattedData = `mailto:${emailAddress}${emailParams}`;
          break;
        case "phone":
          formattedData = `tel:${content.replace(/\D/g, "")}`;
          break;
        case "sms":
          const smsIndex = content.indexOf("?");
          const smsNumber = content
            .substring(0, smsIndex === -1 ? content.length : smsIndex)
            .replace(/\D/g, "");
          const smsMessage =
            smsIndex !== -1 ? `?${content.substring(smsIndex + 1)}` : "";
          formattedData = `sms:${smsNumber}${smsMessage}`;
          break;
        case "wifi":
          const wifiParts = content.split(",");
          if (wifiParts.length >= 3) {
            const ssid = wifiParts[0]?.trim() ?? "";
            const wifiType = wifiParts[1]?.trim() ?? "";
            const password = wifiParts[2]?.trim() ?? "";
            const hidden = wifiParts[3]?.trim() === "true" ? "true" : "false";

            formattedData = `WIFI:S:${ssid};T:${wifiType};P:${password};H:${hidden};`;
          } else {
            setFeedbackMessage(
              "For Wi-Fi, please provide: SSID,Type (WEP/WPA/blank),Password,Hidden(true/false)",
            );
            setIsError(true);
            return;
          }
          break;
        case "url":
          if (
            !content.startsWith("http://") &&
            !content.startsWith("https://")
          ) {
            formattedData = `https://${content}`;
          }
          break;
        case "text":
        default:
          break;
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
          setUserQrCodes((prev) => [result.qrCode, ...prev]);
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
        }
      } catch (error: unknown) {
        console.error("Error generating QR code:", error);
        let message = "An unexpected error occurred.";
        if (error instanceof Error) {
          message = error.message;
        }
        setFeedbackMessage(message);
        setIsError(true);
      }
    },
    [qrType, session?.user?.id, status],
  );

  const handleDelete = async (id: number) => {
    setFeedbackMessage(null);
    setIsError(false);
    // IMPORTANT: Do NOT use confirm() or window.confirm(). Use a custom modal UI instead.
    // This is a temporary placeholder for demonstration.
    if (confirm("Are you sure you want to delete this QR code?")) {
      try {
        const result = await deleteQrCode(id);
        if (result.success) {
          setFeedbackMessage("QR Code deleted successfully!");
          setUserQrCodes((prev) => prev.filter((code) => code.id !== id));
        } else {
          setFeedbackMessage(result.message ?? "Failed to delete QR code.");
          setIsError(true);
        }
      } catch (error: unknown) {
        console.error("Error deleting QR code:", error);
        let message = "An unexpected error occurred during deletion.";
        if (error instanceof Error) {
          message = error.message;
        }
        setFeedbackMessage(message);
        setIsError(true);
      }
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch user's QR codes when session status changes to authenticated
  useEffect(() => {
    async function fetchCodes() {
      if (status === "authenticated") {
        const codes = await getUserQrCodes();
        setUserQrCodes(codes);
      } else {
        setUserQrCodes([]); // Clear codes if not authenticated
      }
    }
    void fetchCodes();
  }, [status]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-gray-700">Loading session...</p>
      </main>
    );
  }

  // If unauthenticated, the useEffect will redirect.
  // This ensures no UI is shown before redirect for unauthenticated users.
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <Card className="rounded-lg p-6 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              QR Code Generator Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600">
              Generate and manage your QR codes here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div className="flex w-full items-center justify-between">
                <p className="text-lg text-gray-800">
                  Welcome, {session?.user?.name ?? "User"}!
                </p>
                <div className="flex gap-2">
                  <Link href="/" passHref>
                    <Button variant="outline">Back to Home</Button>
                  </Link>
                  <Button
                    onClick={() => void signOut()}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Sign out
                  </Button>
                </div>
              </div>

              {/* Integrating the QR Code Generator Form component */}
              <QrCodeGeneratorForm
                qrContent={qrContent}
                setQrContent={setQrContent}
                qrTitle={qrTitle}
                setQrTitle={setQrTitle}
                qrType={qrType}
                setQrType={handleQrTypeChange} // Use the specific handler
                handleSubmit={handleSubmit}
                feedbackMessage={feedbackMessage}
                isError={isError}
              />

              {/* Integrating the Newly Generated QR Code Display component */}
              {generatedQrData && (
                <GeneratedQrCodeDisplay
                  generatedQrData={generatedQrData}
                  generatedQrType={generatedQrType}
                />
              )}

              {/* Integrating the Saved QR Codes List component */}
              <SavedQrCodeList
                userQrCodes={userQrCodes}
                handleDelete={handleDelete}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
