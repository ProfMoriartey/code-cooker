// src/components/dashboard/qr-code-card.tsx
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
// QRCodeDisplay import is removed as it's now in a popup
import { type QRCode } from "~/lib/types";

type QrCodeCardProps = {
  qrCode: QRCode;
  onDelete: (id: number) => void;
  onEdit: (qrCode: QRCode) => void;
  onView: (qrCode: QRCode) => void; // Prop for viewing the QR code in a popup
};

export default function QrCodeCard({
  qrCode,
  onDelete,
  onEdit,
  onView,
}: QrCodeCardProps) {
  return (
    // Make the entire card clickable for viewing, add cursor-pointer
    <Card
      className="flex cursor-pointer flex-col items-center justify-between rounded-lg p-4 shadow-md transition-shadow duration-200 hover:shadow-lg"
      onClick={() => onView(qrCode)} // Handle card click to view QR code
    >
      <CardHeader className="w-full pb-2">
        <CardTitle className="truncate text-lg">
          {qrCode.title ?? "Untitled QR Code"}
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-gray-500">
          Type: {qrCode.type.charAt(0).toUpperCase() + qrCode.type.slice(1)}{" "}
          {qrCode.isDynamic && (
            <span className="font-semibold text-indigo-600">(Dynamic)</span>
          )}
        </CardDescription>
      </CardHeader>

      {/* Main content area: details on left, buttons on right (PC) / stacked (mobile) */}
      <CardContent className="flex w-full flex-1 flex-col p-0 md:flex-row md:items-center md:justify-between">
        {/* QR Code Details Section - always on the left / top */}
        <div className="mb-4 w-full flex-1 space-y-1 text-center text-sm text-gray-700 md:mb-0 md:pr-4 md:text-left">
          {" "}
          {/* Added md:pr-4 for spacing */}
          {qrCode.isDynamic ? (
            <>
              <p>
                <span className="font-medium">Target URL:</span>{" "}
                <span className="block truncate text-blue-600">
                  {qrCode.targetUrl}
                </span>
              </p>
              <p>
                <span className="font-medium">Short Code:</span>{" "}
                <span className="block truncate">{qrCode.shortCode}</span>
              </p>
              <p>
                <span className="font-medium">Scans:</span> {qrCode.scanCount}
              </p>
            </>
          ) : (
            <>
              <p>
                <span className="font-medium">Content:</span>{" "}
                <span className="block truncate">{qrCode.data}</span>
              </p>
            </>
          )}
        </div>

        {/* Action Buttons - aligned to the right / bottom */}
        <div
          className="flex w-full flex-shrink-0 justify-center gap-2 md:w-auto md:justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            onClick={() => onEdit(qrCode)}
            variant="outline"
            className="flex-1 px-3 py-1 text-sm md:flex-none" // flex-none to prevent stretching on desktop
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(qrCode.id)}
            className="flex-1 bg-red-500 px-3 py-1 text-sm hover:bg-red-600 md:flex-none" // flex-none to prevent stretching on desktop
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
