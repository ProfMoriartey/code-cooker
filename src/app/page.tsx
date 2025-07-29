// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { createQrCode, getUserQrCodes, deleteQrCode } from "~/app/actions"; // Import actions
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
import { qrCodeTypeEnum } from "~/server/db/schema"; // Import the enum from your schema
import type { QRCode } from "~/server/db/schema"; // Import the QRCode type if you added it in schema.ts

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
  const [qrType, setQrType] =
    useState<(typeof qrCodeTypeEnum.enumValues)[number]>("text");
  const [qrTitle, setQrTitle] = useState("");
  const [generatedQrData, setGeneratedQrData] = useState("");
  const [generatedQrType, setGeneratedQrType] =
    useState<(typeof qrCodeTypeEnum.enumValues)[number]>("text");
  const [userQrCodes, setUserQrCodes] = useState<QRCode[]>([]); // Use the imported QRCode type
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

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
    void fetchCodes(); // Call the async function
  }, [status]); // Dependency array includes status to refetch on auth change

  const handleSubmit = async (formData: FormData) => {
    setFeedbackMessage(null);
    setIsError(false);
    try {
      // Append the selected type to formData manually since Shadcn Select doesn't add a hidden input by default
      formData.append("type", qrType);

      const result = await createQrCode(formData);
      if (result.success && result.qrCode) {
        setGeneratedQrData(result.qrCode.data);
        setGeneratedQrType(result.qrCode.type);
        setQrContent(""); // Clear input after successful generation
        setQrTitle("");
        setFeedbackMessage("QR Code generated and saved successfully!");
        setUserQrCodes((prev) => [result.qrCode!, ...prev]); // Add new QR to the top of the list
      } else {
        console.error(
          "Failed to generate QR code:",
          result.message,
          result.errors,
        );
        setFeedbackMessage(
          result.message || "Failed to generate QR code. Please try again.",
        );
        setIsError(true);
      }
    } catch (error: any) {
      console.error("Error generating QR code:", error);
      setFeedbackMessage(error.message || "An unexpected error occurred.");
      setIsError(true);
    }
  };

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
          setFeedbackMessage(result.message || "Failed to delete QR code.");
          setIsError(true);
        }
      } catch (error: any) {
        console.error("Error deleting QR code:", error);
        setFeedbackMessage(
          error.message || "An unexpected error occurred during deletion.",
        );
        setIsError(true);
      }
    }
  };

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
        {" "}
        {/* Increased max-width for list */}
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
                  Welcome, {session.user?.name || "User"}!
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
                    <Select
                      value={qrType}
                      onValueChange={(value) =>
                        setQrType(
                          value as (typeof qrCodeTypeEnum.enumValues)[number],
                        )
                      } // Fix applied here
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {qrCodeTypeEnum.enumValues.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
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
                    You haven't saved any QR codes yet. Generate one above!
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
                            {qr.title || "Untitled QR Code"}
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
                  onClick={() => void signIn()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Sign in
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
