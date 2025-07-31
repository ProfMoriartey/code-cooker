// src/app/dashboard/saved-qr-codes/page.tsx
"use client";

import { useState, useEffect } from "react";

import { getUserQrCodes, updateQrCode } from "~/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type QRCode } from "~/lib/types"; // Ensure QrCodeType is imported for QRCodeDisplay

import SavedQrCodeList from "~/components/dashboard/saved-qr-code-list";
import FeedbackDisplay from "~/components/shared/feedback-display";
import DeleteConfirmationModal from "~/components/dashboard/delete-confirmation-modal";
import QrCodeEditForm from "~/components/dashboard/qr-code-edit-form";
import { useQrCodeDeletion } from "~/hooks/use-qr-code-deletion";

// Import Shadcn UI Dialog components for the popup
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { QRCodeDisplay } from "~/components/qr-code-display"; // Import QRCodeDisplay

export default function SavedQrCodesPage() {
  const [userQrCodes, setUserQrCodes] = useState<QRCode[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [editingQrCode, setEditingQrCode] = useState<QRCode | null>(null);
  const [viewingQrCode, setViewingQrCode] = useState<QRCode | null>(null); // New state for QR code popup

  const {
    isDeleteModalOpen,

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
    setViewingQrCode(null); // Close view popup if open
  };

  const handleSaveEdit = async (updatedQrCode: QRCode) => {
    setFeedbackMessage("Saving changes...");
    setIsError(false);

    try {
      const result = await updateQrCode(updatedQrCode);

      if (result.success) {
        setUserQrCodes((prevCodes) =>
          prevCodes.map((qr) =>
            qr.id === updatedQrCode.id ? updatedQrCode : qr,
          ),
        );
        setFeedbackMessage(result.message);
        setIsError(false);
        setEditingQrCode(null);
      } else {
        setFeedbackMessage(result.message ?? "Failed to update QR code.");
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

  // New handler for viewing QR code in popup
  const handleView = (qrCode: QRCode) => {
    setViewingQrCode(qrCode);
    setEditingQrCode(null); // Close edit form if open
  };

  // Handler to close the QR code popup
  const handleCloseView = () => {
    setViewingQrCode(null);
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

  // Determine the data to be displayed in the QR code image for the popup
  const qrPopupData = viewingQrCode?.isDynamic
    ? `${window.location.origin}/qr/${viewingQrCode.shortCode}`
    : viewingQrCode?.data;

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
            onView={handleView}
          />
        </CardContent>
      </Card>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        itemName="QR code"
      />

      {/* QR Code Display Popup */}
      <Dialog open={!!viewingQrCode} onOpenChange={handleCloseView}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{viewingQrCode?.title ?? "QR Code"}</DialogTitle>
            <DialogDescription>
              {viewingQrCode?.isDynamic ? "Dynamic QR Code" : "Static QR Code"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {viewingQrCode && (
              <QRCodeDisplay
                initialData={qrPopupData ?? ""} // Pass the correct data for the QR code
                initialType={viewingQrCode.type}
                size={250} // Larger size for popup
                foregroundColor={viewingQrCode.foregroundColor}
                backgroundColor={viewingQrCode.backgroundColor}
              />
            )}
          </div>
          {viewingQrCode?.isDynamic && (
            <div className="space-y-1 text-center text-sm text-gray-700">
              <p>
                <span className="font-medium">Target URL:</span>{" "}
                <span className="block truncate text-blue-600">
                  {viewingQrCode.targetUrl}
                </span>
              </p>
              <p>
                <span className="font-medium">Short Code:</span>{" "}
                <span className="block truncate">
                  {viewingQrCode.shortCode}
                </span>
              </p>
              <p>
                <span className="font-medium">Scans:</span>{" "}
                {viewingQrCode.scanCount}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
