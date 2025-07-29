// src/app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { qrCodes, qrCodeTypeEnum } from "~/server/db/schema";
import { auth } from "~/server/auth";
import { z } from "zod"; // For validation
import { eq } from "drizzle-orm";

const createQrCodeSchema = z.object({
  title: z.string().max(255).optional(),
  data: z.string().min(1, "QR code content cannot be empty."),
  type: z.enum(qrCodeTypeEnum.enumValues).default("text"), // Validate against the enum values
});

export async function createQrCode(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated. Please sign in." };
  }

  const parsed = createQrCodeSchema.safeParse({
    title: formData.get("title")?.toString() || undefined,
    data: formData.get("data")?.toString(),
    type: formData.get("type")?.toString(),
  });

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues);
    return { success: false, message: "Invalid input provided.", errors: parsed.error.issues };
  }

  const { title, data, type } = parsed.data;

  try {
    const [newQrCode] = await db.insert(qrCodes).values({
      userId: session.user.id,
      title: title || null,
      data: data,
      type: type,
    }).returning(); // .returning() to get the inserted data

    revalidatePath("/"); // Revalidate the home page to show new QR codes if listing them

    return { success: true, message: "QR Code saved!", qrCode: newQrCode };
  } catch (error) {
    console.error("Error saving QR code:", error);
    return { success: false, message: "Failed to save QR code." };
  }
}

// Optional: Add a function to fetch user's QR codes
export async function getUserQrCodes() {
  const session = await auth();

  if (!session?.user?.id) {
    return []; // Return empty array if not authenticated
  }

  try {
    const userQrCodes = await db.query.qrCodes.findMany({
      where: (qrCodes, { eq }) => eq(qrCodes.userId, session.user.id),
      orderBy: (qrCodes, { desc }) => desc(qrCodes.createdAt),
    });
    return userQrCodes;
  } catch (error) {
    console.error("Error fetching user QR codes:", error);
    return [];
  }
}

export async function deleteQrCode(id: number) {
  "use server";
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated." };
  }

  try {
    await db.delete(qrCodes).where(eq(qrCodes.id, id));
    revalidatePath("/"); // Revalidate to reflect deletion
    return { success: true, message: "QR Code deleted." };
  } catch (error) {
    console.error("Error deleting QR code:", error);
    return { success: false, message: "Failed to delete QR code." };
  }
}
