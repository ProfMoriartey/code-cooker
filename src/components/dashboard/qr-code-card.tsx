// src/components/dashboard/qr-code-card.tsx
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter, // Import CardFooter
} from "~/components/ui/card";
import { type QRCode } from "~/lib/types"; // Ensure this path is correct for your QRCode type
import {
  QrCode as QrCodeIcon,
  Pencil,
  Trash2,
  Link,
  Scan,
  Eye,
} from "lucide-react"; // Import QrCode, Pencil, Trash2, Link, Scan, Eye icons

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
    <Card className="relative flex flex-col overflow-hidden rounded-lg shadow-md transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-1">
        {" "}
        {/* Reduced padding */}
        <div className="space-y-0.5">
          {" "}
          {/* Reduced space-y */}
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            {" "}
            {/* Reduced font size */}
            <QrCodeIcon className="h-5 w-5 text-indigo-600" />{" "}
            {/* Reduced icon size */}
            <span className="truncate">
              {qrCode.title ?? "Untitled QR Code"}
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            {" "}
            {/* Reduced font size */}
            Type: {qrCode.type.charAt(0).toUpperCase() +
              qrCode.type.slice(1)}{" "}
            {qrCode.isDynamic && (
              <span className="font-semibold text-indigo-600">(Dynamic)</span>
            )}
          </CardDescription>
        </div>
        {/* View button as part of the header for quick access */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onView(qrCode);
          }}
          className="ml-auto h-7 w-7 text-gray-400 hover:text-indigo-600" // Reduced button size
          aria-label="View QR Code"
        >
          <Eye className="h-4 w-4" /> {/* Reduced icon size */}
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between p-4 pt-1">
        {" "}
        {/* Reduced padding */}
        {/* QR Code Details Section */}
        <div className="mb-3 space-y-1.5 text-sm text-gray-700">
          {" "}
          {/* Reduced margin-bottom and space-y */}
          {qrCode.isDynamic ? (
            <>
              <div className="flex items-center">
                <Link className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium">Target URL:</span>{" "}
                <a
                  href={qrCode.targetUrl ?? "#"} // Added nullish coalescing to provide a fallback empty string
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 truncate text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                >
                  {qrCode.targetUrl}
                </a>
              </div>
              <div className="flex items-center">
                <QrCodeIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium">Short Code:</span>{" "}
                <span className="ml-1 truncate">{qrCode.shortCode}</span>
              </div>
              <div className="flex items-center">
                <Scan className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium">Scans:</span>{" "}
                <span className="ml-1">{qrCode.scanCount}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start">
                <QrCodeIcon className="mt-0.5 mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium">Content:</span>{" "}
                <span className="ml-1 line-clamp-2">{qrCode.data}</span>{" "}
                {/* Use line-clamp for long static content */}
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        {" "}
        {/* Reduced padding */}
        {/* Action Buttons */}
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onEdit(qrCode);
          }}
          variant="outline"
          className="flex-1 items-center gap-1 px-3 py-1.5 text-xs md:flex-none" // Reduced padding and font size
        >
          <Pencil className="h-3.5 w-3.5" /> {/* Reduced icon size */}
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onDelete(qrCode.id);
          }}
          variant="destructive" // Use destructive variant for delete
          className="flex-1 items-center gap-1 px-3 py-1.5 text-xs md:flex-none" // Reduced padding and font size
        >
          <Trash2 className="h-3.5 w-3.5" /> {/* Reduced icon size */}
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
