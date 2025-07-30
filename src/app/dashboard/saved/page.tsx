// src/app/dashboard/saved/page.tsx
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

import SavedQrCodeList from "~/components/dashboard/saved-qr-code-list";
import FeedbackDisplay from "~/components/shared/feedback-display";
import DeleteConfirmationModal from "~/components/dashboard/delete-confirmation-modal";
import { useQrCodeDeletion } from "~/hooks/use-qr-code-deletion";

export default function SavedQrCodesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userQrCodes, setUserQrCodes] = useState<QRCode[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const {
    isDeleteModalOpen,
    qrCodeToDeleteId,
    handleDeleteTrigger,
    confirmDelete,
    cancelDelete,
  } = useQrCodeDeletion({ setFeedbackMessage, setIsError, setUserQrCodes });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchCodes() {
      if (status === "authenticated") {
        try {
          const codes = await getUserQrCodes();
          setUserQrCodes(codes);
        } catch (error) {
          console.error("Failed to fetch QR codes:", error);
          setFeedbackMessage("Failed to load QR codes.");
          setIsError(true);
        }
      } else {
        setUserQrCodes([]);
      }
    }
    void fetchCodes();
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-gray-700">Loading session...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <Card className="rounded-lg p-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Your Saved QR Codes
          </CardTitle>
          <CardDescription className="text-gray-600">
            Manage all your previously generated QR codes here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackDisplay message={feedbackMessage} isError={isError} />
          <SavedQrCodeList
            userQrCodes={userQrCodes}
            handleDelete={handleDeleteTrigger}
          />
        </CardContent>
      </Card>
    </div>
  );
}
