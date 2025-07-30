// src/components/dashboard/qr-code-card.tsx
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

type QrCodeCardProps = {
  qrCode: QRCode;
  onDelete: (id: number) => void;
  onEdit: (qrCode: QRCode) => void; // New prop for edit functionality
};

export default function QrCodeCard({
  qrCode,
  onDelete,
  onEdit,
}: QrCodeCardProps) {
  // Determine the data to be displayed in the QR code image
  const qrImageData = qrCode.isDynamic
    ? `${window.location.origin}/qr/${qrCode.shortCode}` // Use full dynamic URL
    : qrCode.data; // Use static content

  return (
    <Card className="flex flex-col items-center justify-between rounded-lg p-4 shadow-md">
      <CardHeader className="w-full">
        <CardTitle className="truncate text-lg">
          {qrCode.title ?? "Untitled QR Code"}
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-gray-500">
          Type: {qrCode.type.charAt(0).toUpperCase() + qrCode.type.slice(1)}{" "}
          {qrCode.isDynamic && (
            <span className="font-semibold text-indigo-600">(Dynamic)</span>
          )}{" "}
          {/* Indicate dynamic */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full flex-col items-center">
        <QRCodeDisplay
          initialData={qrImageData} // Pass the correct data for QR image
          initialType={qrCode.type} // Type is always URL for dynamic
          size={150}
          backgroundColor={qrCode.backgroundColor}
          foregroundColor={qrCode.foregroundColor}
        />
        {qrCode.isDynamic ? (
          <div className="mt-4 w-full text-center text-sm text-gray-700">
            <p className="font-medium">Target URL:</p>
            <p className="truncate text-blue-600">{qrCode.targetUrl}</p>
            <p className="mt-2 font-medium">Short Code:</p>
            <p className="truncate">{qrCode.shortCode}</p>
            <p className="mt-2 font-medium">Scans:</p>
            <p>{qrCode.scanCount}</p>
          </div>
        ) : (
          <div className="mt-4 w-full text-center text-sm text-gray-700">
            <p className="font-medium">Content:</p>
            <p className="truncate">{qrCode.data}</p>
          </div>
        )}

        <div className="mt-4 flex w-full justify-center gap-2">
          <Button
            onClick={() => onEdit(qrCode)}
            variant="outline"
            className="px-3 py-1 text-sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(qrCode.id)}
            className="bg-red-500 px-3 py-1 text-sm hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
