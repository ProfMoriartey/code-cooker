// src/app/actions.ts
"use server"; // Mark all functions in this file as server actions

import { auth } from "~/server/auth"; // Import the auth function
import { db } from "~/server/db"; // Import your Drizzle database instance
import { qrCodes } from "~/server/db/schema"; // Import your QR codes schema
import { eq } from "drizzle-orm"; // Import Drizzle ORM functions
import { QrCodeType, type QRCode } from "~/lib/types"; // Import shared types
import { customAlphabet } from 'nanoid'; // For generating unique short codes

// Define the input type for creating a static QR code
interface CreateStaticQrCodeInput {
  data: string;
  type: QrCodeType;
  title: string | null;
  foregroundColor: string; // Add foregroundColor
  backgroundColor: string; // Add backgroundColor
}

// Define the input type for creating a dynamic QR code
interface CreateDynamicQrCodeInput {
  title: string | null;
  targetUrl: string; // The URL the dynamic QR code will redirect to
  foregroundColor: string;
  backgroundColor: string;
}

// Helper to generate a unique short code
const generateShortCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

// Server Action to create a new static QR code
export async function createQrCode(input: CreateStaticQrCodeInput) {
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
        foregroundColor: input.foregroundColor,
        backgroundColor: input.backgroundColor,
        isDynamic: false, // Mark as static
        shortCode: null, // No short code for static
        targetUrl: null, // No target URL for static
        scanCount: 0, // No scan count for static
      })
      .returning();

    if (!newQrCode) {
      return { success: false, error: "Failed to create QR code.", details: null, qrCode: null };
    }

    // Ensure the returned newQrCode object fully matches the QRCode type including colors
    const resultQrCode: QRCode = {
      ...newQrCode,
      createdAt: new Date(newQrCode.createdAt),
      // If 'updatedAt' is not in your schema, remove this line or add it to schema
      // updatedAt: new Date(newQrCode.updatedAt),
    } as QRCode; // Cast to QRCode to ensure type compatibility

    return { success: true, qrCode: resultQrCode, error: null, details: null };
  } catch (error: unknown) {
    console.error("Database error creating static QR code:", error);
    let errorMessage = "An unknown database error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: "Database error.", details: errorMessage, qrCode: null };
  }
}

// Server Action to create a new dynamic QR code
export async function createDynamicQrCode(input: CreateDynamicQrCodeInput): Promise<{ success: boolean; error: string | null; qrCode: QRCode | null }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated.", qrCode: null };
  }

  const shortCode = generateShortCode(); // Generate a unique short code

  try {
    const [newQrCode] = await db
      .insert(qrCodes)
      .values({
        userId: session.user.id,
        data: shortCode, // Store the short code in the data field
        type: QrCodeType.URL, // Dynamic QR codes will always be URLs (for redirection)
        title: input.title,
        foregroundColor: input.foregroundColor,
        backgroundColor: input.backgroundColor,
        isDynamic: true, // Mark as dynamic
        shortCode: shortCode,
        targetUrl: input.targetUrl,
        scanCount: 0,
      })
      .returning();

    if (!newQrCode) {
      return { success: false, error: "Failed to create dynamic QR code.", qrCode: null };
    }

    const resultQrCode: QRCode = {
      ...newQrCode,
      createdAt: new Date(newQrCode.createdAt),
    } as QRCode;

    return { success: true, qrCode: resultQrCode, error: null };
  } catch (error: unknown) {
    console.error("Database error creating dynamic QR code:", error);
    let errorMessage = "An unknown database error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage, qrCode: null };
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
      orderBy: (table, { desc: orderByDesc }) => [orderByDesc(table.createdAt)],
    });

    return codes.map(qr => ({
      ...qr,
      createdAt: new Date(qr.createdAt),
      // If 'updatedAt' is not in your schema, remove this line or add it to schema
      // updatedAt: new Date(qr.updatedAt),
    })) as QRCode[]; // Ensure the mapping correctly casts to QRCode including new color fields
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
      .returning({ id: qrCodes.id }); // Returning just the ID is usually enough to confirm deletion

    if (result.length === 0 || result[0]?.id !== id) { // Double check if the deleted id matches
      return { success: false, message: "QR Code not found or you don't have permission to delete it." };
    }

    return { success: true, message: "QR Code deleted successfully!" };
  } catch (error: unknown) {
    console.error("Database error deleting QR code:", error);
    let errorMessage = "An unknown database error occurred during deletion.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}

// Server Action to update an existing QR code
export async function updateQrCode(updatedQrCode: QRCode): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated." };
  }

  if (!updatedQrCode.id) {
    return { success: false, message: "QR code ID is missing for update." };
  }

  try {
    const result = await db
      .update(qrCodes)
      .set({
        title: updatedQrCode.title,
        data: updatedQrCode.data,
        type: updatedQrCode.type,
        foregroundColor: updatedQrCode.foregroundColor,
        backgroundColor: updatedQrCode.backgroundColor,
        isDynamic: updatedQrCode.isDynamic, // Ensure this is passed
        shortCode: updatedQrCode.shortCode, // Ensure this is passed
        targetUrl: updatedQrCode.targetUrl, // Ensure this is passed
        scanCount: updatedQrCode.scanCount, // Ensure this is passed
        // createdAt should not be updated here
        // If you have an 'updatedAt' field in your schema, you would set it here:
        // updatedAt: new Date(),
      })
      .where(eq(qrCodes.id, updatedQrCode.id))
      .returning({ id: qrCodes.id }); // Return the ID to confirm the update

    if (result.length === 0) {
      return { success: false, message: "QR code not found or you don't have permission to update it." };
    }

    return { success: true, message: "QR code updated successfully!" };
  } catch (error: unknown) {
    console.error("Database error updating QR code:", error);
    let errorMessage = "An unknown database error occurred during update.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}
