// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { getUserQrCodes } from "~/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type QRCode } from "~/lib/types";

// Import components and new hooks
import QrCodeGeneratorForm from "~/components/dashboard/qr-code-generator-form";
import GeneratedQrCodeDisplay from "~/components/dashboard/generated-qr-code-display";
import SavedQrCodeList from "~/components/dashboard/saved-qr-code-list";
import AuthStatusAndActions from "~/components/dashboard/auth-status-and-actions";
import FeedbackDisplay from "~/components/shared/feedback-display";
import DeleteConfirmationModal from "~/components/dashboard/delete-confirmation-modal";
import { useQrCodeGenerator } from "~/hooks/use-qr-code-generator";
import { useQrCodeDeletion } from "~/hooks/use-qr-code-deletion";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    qrContent,
    setQrContent,
    qrType,
    setQrType,
    qrTitle,
    setQrTitle,
    generatedQrData,
    generatedQrType,
    feedbackMessage,
    setFeedbackMessage,
    isError,
    setIsError,
    foregroundColor, // Destructure new values
    setForegroundColor, // Destructure new values
    backgroundColor, // Destructure new values
    setBackgroundColor, // Destructure new values
    generateQrCode,
  } = useQrCodeGenerator();

  const [userQrCodes, setUserQrCodes] = useState<QRCode[]>([]);

  const {
    isDeleteModalOpen,
    qrCodeToDeleteId,
    handleDeleteTrigger,
    confirmDelete,
    cancelDelete,
  } = useQrCodeDeletion({ setFeedbackMessage, setIsError, setUserQrCodes });

  const handleGenerateSubmit = async (formData: FormData) => {
    const newQrCode = await generateQrCode(formData);
    if (newQrCode) {
      setUserQrCodes((prev) => [newQrCode, ...prev]);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchCodes() {
      if (status === "authenticated") {
        const codes = await getUserQrCodes();
        setUserQrCodes(codes);
      } else {
        setUserQrCodes([]);
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
              <AuthStatusAndActions session={session} />

              <FeedbackDisplay message={feedbackMessage} isError={isError} />

              <QrCodeGeneratorForm
                qrContent={qrContent}
                setQrContent={setQrContent}
                qrTitle={qrTitle}
                setQrTitle={setQrTitle}
                qrType={qrType}
                setQrType={setQrType}
                handleSubmit={handleGenerateSubmit}
                foregroundColor={foregroundColor} // Pass new prop
                setForegroundColor={setForegroundColor} // Pass new prop
                backgroundColor={backgroundColor} // Pass new prop
                setBackgroundColor={setBackgroundColor} // Pass new prop
                feedbackMessage={null}
                isError={false}
              />

              {generatedQrData && (
                <GeneratedQrCodeDisplay
                  generatedQrData={generatedQrData}
                  generatedQrType={generatedQrType}
                  // If generatedQrData holds the full QR code object, pass its colors
                  // For now, assuming you'll get colors from useQrCodeGenerator if it represents the latest generated.
                  // Or, you can update GeneratedQrCodeDisplay to accept full QRCode object and derive colors from it.
                  // For now, these colors will come from the current state of the generator.
                  foregroundColor={foregroundColor}
                  backgroundColor={backgroundColor}
                />
              )}

              <SavedQrCodeList
                userQrCodes={userQrCodes}
                handleDelete={handleDeleteTrigger}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        itemName="QR code"
      />
    </main>
  );
}
