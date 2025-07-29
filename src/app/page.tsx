// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { createQrCode, getUserQrCodes, deleteQrCode } from "~/app/actions";
import { QRCodeDisplay } from "~/components/qr-code-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useFormStatus } from "react-dom";
import { qrCodeTypeEnum, type QrCodeType, type QRCode } from "~/lib/types";

// A helper component for the submit button to show loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-4 w-full">
      {pending ? "Generating..." : "Generate & Save QR Code"}
    </Button>
  );
}

export default function HomePage() {
  const { data: session, status } = useSession();
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
  }, []); // Empty dependency array as setQrType is stable

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setFeedbackMessage(null);
      setIsError(false);

      const content = formData.get("data") as string;
      const title = (formData.get("title") as string) ?? null;
      // const type = formData.get("type") as QrCodeType; // REMOVED THIS LINE

      if (!content) {
        setFeedbackMessage("QR code content cannot be empty.");
        setIsError(true);
        return;
      }

      if (!session?.user?.id) {
        setFeedbackMessage(
          "You must be signed in to generate and save QR codes.",
        );
        setIsError(true);
        return;
      }

      let formattedData = content;

      // Use qrType directly from state
      switch (
        qrType // CHANGED 'type' to 'qrType' here
      ) {
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
          type: qrType, // Use qrType directly from state
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
    [qrType, session?.user?.id], // Added qrType to dependencies to ensure callback re-creates when qrType changes
  );

  const handleDelete = async (id: number) => {
    setFeedbackMessage(null);
    setIsError(false);
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <Card className="rounded-lg p-6 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              QR Code Generator App
            </CardTitle>
            <CardDescription className="text-gray-600">
              Generate and save QR codes for your content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {session ? (
              <div className="flex flex-col items-center space-y-6">
                <p className="text-lg text-gray-800">
                  Welcome, {session.user?.name ?? "User"}!
                </p>
                <Button
                  onClick={() => void signOut()}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Sign out
                </Button>

                {feedbackMessage && (
                  <div
                    className={`mt-4 w-full rounded-md p-3 text-center ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                  >
                    {feedbackMessage}
                  </div>
                )}

                <form action={handleSubmit} className="w-full space-y-4">
                  <div>
                    <Label htmlFor="title">QR Code Title (Optional)</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g., My Website Link"
                      value={qrTitle}
                      onChange={(e) => setQrTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="data">Content for QR Code</Label>
                    <Textarea
                      id="data"
                      name="data"
                      placeholder="Enter text, a URL (e.g., https://example.com), email, phone number, etc."
                      value={qrContent}
                      onChange={(e) => setQrContent(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">QR Code Type</Label>
                    <Select value={qrType} onValueChange={handleQrTypeChange}>
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {qrCodeTypeEnum.map((typeOption) => (
                          <SelectItem key={typeOption} value={typeOption}>
                            {typeOption.charAt(0).toUpperCase() +
                              typeOption.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <SubmitButton />
                </form>

                {generatedQrData && (
                  <div className="mt-8 w-full rounded-lg border bg-gray-50 p-4 shadow-inner">
                    <h3 className="mb-4 text-center text-xl font-semibold">
                      Newly Generated QR Code:
                    </h3>
                    <QRCodeDisplay
                      initialData={generatedQrData}
                      initialType={generatedQrType}
                    />
                  </div>
                )}

                <h3 className="mt-10 w-full text-center text-2xl font-bold">
                  Your Saved QR Codes
                </h3>
                {userQrCodes.length === 0 ? (
                  <p className="mt-4 text-gray-500">
                    You haven&apos;t saved any QR codes yet. Generate one above!
                  </p>
                ) : (
                  <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userQrCodes.map((qr) => (
                      <Card
                        key={qr.id}
                        className="flex flex-col items-center justify-between rounded-lg p-4 shadow-md"
                      >
                        <CardHeader className="w-full">
                          <CardTitle className="truncate text-lg">
                            {qr.title ?? "Untitled QR Code"}
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm text-gray-500">
                            Type:{" "}
                            {qr.type.charAt(0).toUpperCase() + qr.type.slice(1)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex w-full flex-col items-center">
                          <QRCodeDisplay
                            initialData={qr.data}
                            initialType={qr.type}
                            size={150}
                          />
                          <div className="mt-4 flex w-full justify-center">
                            <Button
                              onClick={() => void handleDelete(qr.id)}
                              className="bg-red-500 px-3 py-1 text-sm hover:bg-red-600"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <p className="text-lg text-gray-800">
                  Please sign in to access the QR code generator features.
                </p>
                <Button
                  onClick={() => void signIn("github")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Sign in with GitHub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
