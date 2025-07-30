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
};

export default function QrCodeCard({ qrCode, onDelete }: QrCodeCardProps) {
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
        />
        <div className="mt-4 flex w-full justify-center">
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
