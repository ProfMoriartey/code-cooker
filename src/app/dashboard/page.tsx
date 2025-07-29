// src/app/dashboard/page.tsx
"use client"; // This component uses client-side hooks

import { useState, useCallback } from "react";
import { signOut, useSession } from "next-auth/react"; // For authentication check
import { useRouter } from "next/navigation"; // For redirection
import Link from "next/link"; // For navigation button

// Import the new QR Code Generator Form component
import QrCodeGeneratorForm from "~/components/dashboard/qr-code-generator-form";

// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button"; // For the sign out/back to home buttons

// Import actions for QR code generation
import { createQrCode } from "~/app/actions";

// Import shared types
import { qrCodeTypeEnum, type QrCodeType } from "~/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // State for the QR Code Generator Form
  const [qrContent, setQrContent] = useState<string>("");
  const [qrType, setQrType] = useState<QrCodeType>("text");
  const [qrTitle, setQrTitle] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Handle QR code generation and saving
  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setFeedbackMessage(null);
      setIsError(false);

      // Get values from FormData (name attributes from form fields)
      const content = formData.get("data") as string;
      const title = (formData.get("title") as string) || null;
      const type = formData.get("type") as QrCodeType; // Cast to QrCodeType

      if (!content) {
        setFeedbackMessage("QR code content cannot be empty.");
        setIsError(true);
        return;
      }

      if (session?.user?.id) {
        try {
          let formattedData = content;

          // Apply specific formatting based on type (replicated logic from original file)
          switch (type) {
            case "email":
              const emailParts = content.split("?");
              const emailAddress = emailParts[0];
              const emailParams =
                emailParts.length > 1 ? `?${emailParts[1]}` : "";
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
                // Add optional chaining and nullish coalescing for safety
                const ssid = wifiParts[0]?.trim() ?? "";
                const wifiType = wifiParts[1]?.trim() ?? "";
                const password = wifiParts[2]?.trim() ?? "";
                const hidden =
                  wifiParts[3]?.trim() === "true" ? "true" : "false"; // Already handled this one

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

          const result = await createQrCode({
            data: formattedData,
            type: type, // Pass the type from form data
            title: title,
          });

          if (result?.success) {
            setFeedbackMessage("QR Code generated and saved successfully!");
            setQrContent(""); // Clear input after successful generation
            setQrTitle("");
            // Note: generatedQrData and userQrCodes update will be handled when those components are moved
          } else {
            setFeedbackMessage(result?.error || "Failed to generate QR code.");
            setIsError(true);
          }
        } catch (error: any) {
          console.error("Error generating QR code:", error);
          setFeedbackMessage(error.message || "An unexpected error occurred.");
          setIsError(true);
        }
      } else {
        setFeedbackMessage("You must be signed in to save QR codes.");
        setIsError(true);
      }
    },
    [session?.user?.id],
  );

  // Authentication loading state
  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-gray-700">Loading session...</p>
      </main>
    );
  }

  // Redirect if not authenticated (client-side)
  if (status === "unauthenticated") {
    router.push("/");
    return null; // Return null to prevent rendering before redirect
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Dashboard Header - Simplified for now */}
        <Card className="rounded-lg p-6 text-center shadow-lg">
          <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
          <p className="mt-2 text-lg text-gray-800">
            Welcome, {session?.user?.name || "User"}!
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/" passHref>
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                Back to Home
              </Button>
            </Link>
            <Button
              onClick={() => void signOut()}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Sign out
            </Button>
          </div>
        </Card>

        {/* QR Code Generator Form */}
        <Card className="rounded-lg p-6 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Generate New QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QrCodeGeneratorForm
              qrContent={qrContent}
              setQrContent={setQrContent}
              qrTitle={qrTitle}
              setQrTitle={setQrTitle}
              qrType={qrType}
              setQrType={setQrType}
              handleSubmit={handleSubmit}
              feedbackMessage={feedbackMessage}
              isError={isError}
            />
          </CardContent>
        </Card>

        {/* Placeholder for other components */}
        <Card className="rounded-lg p-6 text-center shadow-lg">
          <CardTitle className="text-2xl font-bold">
            Other Dashboard Features will go here
          </CardTitle>
        </Card>
      </div>
    </main>
  );
}
