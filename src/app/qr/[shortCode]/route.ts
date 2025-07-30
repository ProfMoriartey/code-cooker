// src/app/qr/[shortCode]/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db'; // Your Drizzle DB instance
import { qrCodes } from '~/server/db/schema'; // Your QR codes schema
import { eq } from 'drizzle-orm';

// This API route handles dynamic QR code redirections
export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  // Await the params since they're now a Promise
  const { shortCode } = await params;
  
  if (!shortCode) {
    return new NextResponse('Short code is missing.', { status: 400 });
  }

  try {
    // Find the QR code by its shortCode
    const qrCodeEntry = await db.query.qrCodes.findFirst({
      where: eq(qrCodes.shortCode, shortCode),
    });

    // If QR code not found, or it's not dynamic, or targetUrl is missing
    if (!qrCodeEntry || !qrCodeEntry.isDynamic || !qrCodeEntry.targetUrl) {
      return new NextResponse('QR code not found or is not dynamic.', { status: 404 });
    }

    // Increment scan count (optional, but good for analytics)
    await db
      .update(qrCodes)
      .set({ scanCount: qrCodeEntry.scanCount + 1 })
      .where(eq(qrCodes.id, qrCodeEntry.id));

    // Redirect to the target URL
    return NextResponse.redirect(qrCodeEntry.targetUrl);
  } catch (error) {
    console.error(`Error handling dynamic QR code redirect for ${shortCode}:`, error);
    return new NextResponse('Internal Server Error.', { status: 500 });
  }
}