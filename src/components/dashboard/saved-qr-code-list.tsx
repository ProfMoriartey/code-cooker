// src/components/dashboard/saved-qr-code-list.tsx
"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { QRCodeDisplay } from "~/components/qr-code-display";
import { type QRCode } from "~/lib/types"; // Import QRCode type

interface SavedQrCodeListProps {
  userQrCodes: QRCode[];
  handleDelete: (id: number) => Promise<void>;
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
                  Type: {qr.type.charAt(0).toUpperCase() + qr.type.slice(1)}
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
    </>
  );
}
