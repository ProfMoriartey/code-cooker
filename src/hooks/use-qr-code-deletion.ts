// src/hooks/use-qr-code-deletion.ts
import { useState, useCallback } from "react";
import { deleteQrCode } from "~/app/actions"; // Your Server Action
import { type QRCode } from "~/lib/types"; // Import QRCode type if needed for filtering

type SetFeedbackMessage = (message: string | null) => void;
type SetIsError = (isError: boolean) => void;
type SetUserQrCodes = React.Dispatch<React.SetStateAction<QRCode[]>>;

interface UseQrCodeDeletionProps {
  setFeedbackMessage: SetFeedbackMessage;
  setIsError: SetIsError;
  setUserQrCodes: SetUserQrCodes;
}

export function useQrCodeDeletion({
  setFeedbackMessage,
  setIsError,
  setUserQrCodes,
}: UseQrCodeDeletionProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [qrCodeToDeleteId, setQrCodeToDeleteId] = useState<number | null>(null);

  // Function to open the delete confirmation modal
  const handleDeleteTrigger = useCallback((id: number) => {
    setQrCodeToDeleteId(id);
    setIsDeleteModalOpen(true);
  }, []);

  // Function called when confirming deletion in the modal
  const confirmDelete = useCallback(async () => {
    if (qrCodeToDeleteId === null) return;

    setFeedbackMessage(null);
    setIsError(false);

    try {
      const result = await deleteQrCode(qrCodeToDeleteId);
      if (result.success) {
        setFeedbackMessage("QR Code deleted successfully!");
        setUserQrCodes((prev) =>
          prev.filter((code) => code.id !== qrCodeToDeleteId),
        );
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
    } finally {
      setIsDeleteModalOpen(false); // Close modal
      setQrCodeToDeleteId(null); // Clear the ID
    }
  }, [qrCodeToDeleteId, setFeedbackMessage, setIsError, setUserQrCodes]);

  // Function called when canceling deletion in the modal
  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setQrCodeToDeleteId(null);
  }, []);

  return {
    isDeleteModalOpen,
    qrCodeToDeleteId,
    handleDeleteTrigger,
    confirmDelete,
    cancelDelete,
  };
}