// src/app/dashboard/saved-qr-codes/page.tsx
"use client";

import { useState, useEffect } from "react";

import { getUserQrCodes, updateQrCode } from "~/app/actions"; // Import updateQrCode
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
import QrCodeEditForm from "~/components/dashboard/qr-code-edit-form";
import { useQrCodeDeletion } from "~/hooks/use-qr-code-deletion";

export default function SavedQrCodesPage() {
  const [userQrCodes, setUserQrCodes] = useState<QRCode[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [editingQrCode, setEditingQrCode] = useState<QRCode | null>(null);

  const {
    isDeleteModalOpen,
    qrCodeToDeleteId,
    handleDeleteTrigger,
    confirmDelete,
    cancelDelete,
  } = useQrCodeDeletion({ setFeedbackMessage, setIsError, setUserQrCodes });

  useEffect(() => {
    async function fetchCodes() {
      try {
        const codes = await getUserQrCodes();
        setUserQrCodes(codes);
      } catch (error) {
        console.error("Failed to fetch QR codes:", error);
        setFeedbackMessage("Failed to load QR codes.");
        setIsError(true);
      }
    }
    void fetchCodes();
  }, []);

  const handleEdit = (qrCode: QRCode) => {
    setEditingQrCode(qrCode);
  };

  const handleSaveEdit = async (updatedQrCode: QRCode) => {
    setFeedbackMessage("Saving changes...");
    setIsError(false);

    try {
      const result = await updateQrCode(updatedQrCode); // Call the server action

      if (result.success) {
        // Update local state only if the database update was successful
        setUserQrCodes((prevCodes) =>
          prevCodes.map((qr) =>
            qr.id === updatedQrCode.id ? updatedQrCode : qr,
          ),
        );
        setFeedbackMessage(result.message);
        setIsError(false);
        setEditingQrCode(null); // Exit edit mode
      } else {
        setFeedbackMessage(result.message || "Failed to update QR code.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error saving QR code:", error);
      setFeedbackMessage("An unexpected error occurred while saving.");
      setIsError(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingQrCode(null);
    setFeedbackMessage(null);
    setIsError(false);
  };

  if (editingQrCode) {
    return (
      <div className="w-full max-w-4xl space-y-8">
        <Card className="rounded-lg p-6 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Edit QR Code</CardTitle>
            <CardDescription className="text-gray-600">
              You are editing: {editingQrCode.title ?? "Untitled QR Code"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeedbackDisplay message={feedbackMessage} isError={isError} />
            <QrCodeEditForm
              qrCode={editingQrCode}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          </CardContent>
        </Card>
      </div>
    );
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
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        itemName="QR code"
      />
    </div>
  );
}
