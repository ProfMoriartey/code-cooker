// src/components/dashboard/saved-qr-code-list.tsx
"use client";

// Remove unused imports
import {
  Card, // Keep Card for the overall empty state message or wrapper
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type QRCode } from "~/lib/types"; // Import QRCode type
import QrCodeCard from "~/components/dashboard/qr-code-card"; // New import

interface SavedQrCodeListProps {
  userQrCodes: QRCode[];
  handleDelete: (id: number) => void;
}

export default function SavedQrCodeList({
  userQrCodes,
  handleDelete,
}: SavedQrCodeListProps) {
  return (
    <>
      <h3 className="mt-10 w-full text-center text-2xl font-bold">
        Your Saved QR Codes
      </h3>
      {userQrCodes.length === 0 ? (
        <Card className="mt-4 w-full max-w-lg p-6 text-center shadow-lg">
          {" "}
          {/* Added Card for empty state */}
          <CardHeader>
            <CardTitle>No Saved QR Codes</CardTitle>
            <CardDescription>
              You haven&apos;t saved any QR codes yet. Generate one above!
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userQrCodes.map((qr) => (
            <QrCodeCard key={qr.id} qrCode={qr} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
}
