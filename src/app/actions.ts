// src/app/actions.ts
"use server"; // Mark all functions in this file as server actions

import { auth } from "~/server/auth"; // Import the auth function
import { db } from "~/server/db"; // Import your Drizzle database instance
import { qrCodes } from "~/server/db/schema"; // Import your QR codes schema
import { eq, desc } from "drizzle-orm"; // Import Drizzle ORM functions (desc is now used explicitly)
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
    return { success: false, error: "Not authenticated.", details: null, qrCode: null };
  }

  try {
    const [newQrCode] = await db
      .insert(qrCodes)
      .values({
        userId: session.user.id,
        data: input.data,
        type: input.type,
        title: input.title,
      })
      .returning();

    if (!newQrCode) {
      return { success: false, error: "Failed to create QR code.", details: null, qrCode: null };
    }

    const resultQrCode: QRCode = {
      ...newQrCode,
      createdAt: new Date(newQrCode.createdAt),
      updatedAt: new Date(newQrCode.updatedAt),
    };

    return { success: true, qrCode: resultQrCode, error: null, details: null };
  } catch (error: unknown) { // Use 'unknown' instead of 'any'
    console.error("Database error creating QR code:", error);
    let errorMessage = "An unknown database error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: "Database error.", details: errorMessage, qrCode: null };
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
      orderBy: (table, { desc: orderByDesc }) => [orderByDesc(table.createdAt)], // Use desc as orderByDesc
    });

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
export async function deleteQrCode(id: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated." };
  }

  try {
    const result = await db
      .delete(qrCodes)
      .where(eq(qrCodes.id, id))
      .returning({ id: qrCodes.id });

    if (result.length === 0) {
      return { success: false, message: "QR Code not found or you don't have permission to delete it." };
    }

    return { success: true, message: "QR Code deleted successfully!" };
  } catch (error: unknown) { // Use 'unknown' instead of 'any'
    console.error("Database error deleting QR code:", error);
    let errorMessage = "An unknown database error occurred during deletion.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}
