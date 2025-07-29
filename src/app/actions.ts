// src/app/actions.ts
"use server"; // Mark all functions in this file as server actions

import { auth } from "~/server/auth"; // Import the auth function
import { db } from "~/server/db"; // Import your Drizzle database instance
import { qrCodes } from "~/server/db/schema"; // Import your QR codes schema
import { eq, desc } from "drizzle-orm"; // Import Drizzle ORM functions
import { type QrCodeType, type QRCode } from "~/lib/types"; // Import shared types

// Define the input type for creating a QR code
interface CreateQrCodeInput {
  data: string;
  type: QrCodeType;
  title: string | null;
}

// Server Action to create a new QR code
export async function createQrCode(input: CreateQrCodeInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated." };
  }

  try {
    const [newQrCode] = await db
      .insert(qrCodes)
      .values({
        userId: session.user.id,
        data: input.data, // Use input.data
        type: input.type,
        title: input.title,
      })
      .returning(); // Use .returning() to get the inserted record

    if (!newQrCode) {
      return { success: false, error: "Failed to create QR code.", qrCode: null };
    }

    // Convert Drizzle's `createdAt` and `updatedAt` (which might be raw Date objects) to serializable format if needed
    // For type safety, explicitly cast to QRCode if the returned type is slightly different
    const resultQrCode: QRCode = {
      ...newQrCode,
      createdAt: newQrCode.createdAt ? new Date(newQrCode.createdAt) : new Date(),
      updatedAt: newQrCode.updatedAt ? new Date(newQrCode.updatedAt) : new Date(),
    } as QRCode; // Explicitly cast to QRCode to match interface

    return { success: true, qrCode: resultQrCode };
  } catch (error: any) {
    console.error("Database error creating QR code:", error);
    return { success: false, error: "Database error.", details: error.message };
  }
}

// Server Action to fetch all QR codes for the authenticated user
export async function getUserQrCodes(): Promise<QRCode[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const codes = await db.query.qrCodes.findMany({
      where: eq(qrCodes.userId, session.user.id),
      orderBy: (qrCodesTable, { desc }) => [desc(qrCodesTable.createdAt)], // Use qrCodesTable for column access
    });

    // Ensure dates are correctly typed as Date objects for the client
    return codes.map(qr => ({
      ...qr,
      createdAt: new Date(qr.createdAt),
      updatedAt: new Date(qr.updatedAt),
    })) as QRCode[];
  } catch (error) {
    console.error("Error fetching user QR codes:", error);
    return [];
  }
}

// Server Action to delete a QR code by ID
export async function deleteQrCode(id: number) { // Ensure id is number
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated." };
  }

  try {
    const result = await db
      .delete(qrCodes)
      .where(eq(qrCodes.id, id))
      .returning({ id: qrCodes.id }); // Return the ID of the deleted record

    if (result.length === 0) {
      return { success: false, message: "QR Code not found or you don't have permission to delete it." };
    }

    return { success: true, message: "QR Code deleted successfully!" };
  } catch (error) {
    console.error("Database error deleting QR code:", error);
    return { success: false, message: "Database error during deletion." };
  }
}
