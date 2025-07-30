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
import { type QRCode } from "~/lib/types";

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
  return (
    <Card className="flex flex-col items-center justify-between rounded-lg p-4 shadow-md">
      <CardHeader className="w-full">
        <CardTitle className="truncate text-lg">
          {qrCode.title ?? "Untitled QR Code"}
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-gray-500">
          Type: {qrCode.type.charAt(0).toUpperCase() + qrCode.type.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full flex-col items-center">
        <QRCodeDisplay
          initialData={qrCode.data}
          initialType={qrCode.type}
          size={150}
          backgroundColor={qrCode.backgroundColor}
          foregroundColor={qrCode.foregroundColor}
        />
        <div className="mt-4 flex w-full justify-center gap-2">
          {" "}
          {/* Added gap for buttons */}
          <Button
            onClick={() => onEdit(qrCode)} // Call onEdit with the qrCode object
            variant="outline" // Use outline variant for edit button
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
