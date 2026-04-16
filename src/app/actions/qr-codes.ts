// src/app/actions/qr-codes.ts
"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { qrCodes } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { QrCodeType, type QRCode } from "~/lib/types";
import { customAlphabet } from 'nanoid';

interface CreateStaticQrCodeInput {
  data: string;
  type: QrCodeType;
  title: string | null;
  foregroundColor: string;
  backgroundColor: string;
}

interface CreateDynamicQrCodeInput {
  title: string | null;
  targetUrl: string;
  foregroundColor: string;
  backgroundColor: string;
}

const generateShortCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

export async function createQrCode(input: CreateStaticQrCodeInput) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated.", details: null, qrCode: null };

  try {
    const [newQrCode] = await db.insert(qrCodes).values({
      userId: session.user.id,
      data: input.data,
      type: input.type,
      title: input.title,
      foregroundColor: input.foregroundColor,
      backgroundColor: input.backgroundColor,
      isDynamic: false,
      shortCode: null,
      targetUrl: null,
      scanCount: 0,
    }).returning();

    if (!newQrCode) return { success: false, error: "Failed to create QR code.", details: null, qrCode: null };

    const resultQrCode: QRCode = {
      ...newQrCode,
      createdAt: new Date(newQrCode.createdAt),
    } as QRCode;

    return { success: true, qrCode: resultQrCode, error: null, details: null };
  } catch (error: unknown) {
    console.error("Database error creating static QR code:", error);
    return { success: false, error: "Database error.", details: error instanceof Error ? error.message : "Unknown error", qrCode: null };
  }
}

export async function createDynamicQrCode(input: CreateDynamicQrCodeInput) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated.", qrCode: null };

  const shortCode = generateShortCode();

  try {
    const [newQrCode] = await db.insert(qrCodes).values({
      userId: session.user.id,
      data: shortCode,
      type: QrCodeType.URL,
      title: input.title,
      foregroundColor: input.foregroundColor,
      backgroundColor: input.backgroundColor,
      isDynamic: true,
      shortCode: shortCode,
      targetUrl: input.targetUrl,
      scanCount: 0,
    }).returning();

    if (!newQrCode) return { success: false, error: "Failed to create dynamic QR code.", qrCode: null };

    const resultQrCode: QRCode = {
      ...newQrCode,
      createdAt: new Date(newQrCode.createdAt),
    } as QRCode;

    return { success: true, qrCode: resultQrCode, error: null };
  } catch (error: unknown) {
    console.error("Database error creating dynamic QR code:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error", qrCode: null };
  }
}

export async function getUserQrCodes(): Promise<QRCode[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const codes = await db.query.qrCodes.findMany({
      where: eq(qrCodes.userId, session.user.id),
      orderBy: (table, { desc: orderByDesc }) => [orderByDesc(table.createdAt)],
    });

    return codes.map(qr => ({
      ...qr,
      createdAt: new Date(qr.createdAt),
    })) as QRCode[];
  } catch (error) {
    console.error("Error fetching user QR codes:", error);
    return [];
  }
}

export async function deleteQrCode(id: number) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Not authenticated." };

  try {
    const result = await db.delete(qrCodes).where(eq(qrCodes.id, id)).returning({ id: qrCodes.id });
    if (result.length === 0 || result[0]?.id !== id) return { success: false, message: "QR Code not found." };
    return { success: true, message: "QR Code deleted successfully!" };
  } catch (error: unknown) {
    console.error("Database error deleting QR code:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateQrCode(updatedQrCode: QRCode) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Not authenticated." };
  if (!updatedQrCode.id) return { success: false, message: "QR code ID is missing." };

  try {
    const result = await db.update(qrCodes).set({
      title: updatedQrCode.title,
      data: updatedQrCode.data,
      type: updatedQrCode.type,
      foregroundColor: updatedQrCode.foregroundColor,
      backgroundColor: updatedQrCode.backgroundColor,
      isDynamic: updatedQrCode.isDynamic,
      shortCode: updatedQrCode.shortCode,
      targetUrl: updatedQrCode.targetUrl,
      scanCount: updatedQrCode.scanCount,
    }).where(eq(qrCodes.id, updatedQrCode.id)).returning({ id: qrCodes.id });

    if (result.length === 0) return { success: false, message: "QR code not found." };
    return { success: true, message: "QR code updated successfully!" };
  } catch (error: unknown) {
    console.error("Database error updating QR code:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}