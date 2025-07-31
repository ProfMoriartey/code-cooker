// src/components/dashboard/saved-qr-code-list.tsx
"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type QRCode } from "~/lib/types";
import QrCodeCard from "~/components/dashboard/qr-code-card";

interface SavedQrCodeListProps {
  userQrCodes: QRCode[];
  handleDelete: (id: number) => void;
  onEdit: (qrCode: QRCode) => void;
  onView: (qrCode: QRCode) => void; // New prop for viewing QR code
}

export default function SavedQrCodeList({
  userQrCodes,
  handleDelete,
  onEdit,
  onView, // Destructure new prop
}: SavedQrCodeListProps) {
  return (
    <>
      <h3 className="mt-10 w-full text-center text-2xl font-bold">
        Your Saved QR Codes
      </h3>
      {userQrCodes.length === 0 ? (
        <Card className="mt-4 w-full max-w-lg p-6 text-center shadow-lg">
          <CardHeader>
            <CardTitle>No Saved QR Codes</CardTitle>
            <CardDescription>
              You haven&apos;t saved any QR codes yet. Generate one above!
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
          {userQrCodes.map((qr) => (
            <QrCodeCard
              key={qr.id}
              qrCode={qr}
              onDelete={handleDelete}
              onEdit={onEdit}
              onView={onView} // Pass the onView function down to QrCodeCard
            />
          ))}
        </div>
      )}
    </>
  );
}
