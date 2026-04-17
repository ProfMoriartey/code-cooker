// src/app/actions/multi-pages.ts
"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { multiPageSets, multiPageItems } from "~/server/db/schema";
import { eq, desc, and, asc } from "drizzle-orm"; // Added and, asc
import { type MultiPageSet } from "~/lib/types";
import { customAlphabet } from 'nanoid';

const generateShortCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

export async function getUserMultiPageSets(): Promise<MultiPageSet[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const sets = await db.query.multiPageSets.findMany({
      where: eq(multiPageSets.userId, session.user.id),
      orderBy: [desc(multiPageSets.createdAt)],
    });
    
    return sets.map(set => ({
      ...set,
      createdAt: new Date(set.createdAt),
      updatedAt: new Date(set.updatedAt),
    })) as MultiPageSet[];
  } catch (error) {
    console.error("Error fetching multi-page sets:", error);
    return [];
  }
}

export async function createMultiPageSet(
  title: string, 
  links: { label: string; url: string }[],
  colors: {
    backgroundColor: string;
    buttonColor: string;
    buttonHoverColor: string;
    textColor: string;
  }
) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Not authenticated." };

  if (links.length > 10) {
    return { success: false, message: "You can only add up to 10 links." };
  }

  const shortCode = generateShortCode();

  try {
    const [newSet] = await db.insert(multiPageSets).values({
      userId: session.user.id,
      title: title,
      shortCode: shortCode,
      backgroundColor: colors.backgroundColor,
      buttonColor: colors.buttonColor,
      buttonHoverColor: colors.buttonHoverColor,
      textColor: colors.textColor,
    }).returning();

    if (!newSet) return { success: false, message: "Failed to create the page." };

    if (links.length > 0) {
      const itemsToInsert = links.map((link, index) => ({
        setId: newSet.id,
        label: link.label,
        url: link.url,
        sortOrder: index,
      }));

      await db.insert(multiPageItems).values(itemsToInsert);
    }

    return { success: true, message: "Page created successfully!", shortCode: shortCode };
  } catch (error) {
    console.error("Database error creating multi-page set:", error);
    return { success: false, message: "Database error occurred." };
  }
}

export async function deleteMultiPageSet(id: number) {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Not authenticated." };
    }
  
    try {
      const result = await db
        .delete(multiPageSets)
        .where(eq(multiPageSets.id, id))
        .returning({ id: multiPageSets.id });
  
      if (result.length === 0) {
        return { success: false, message: "Page not found." };
      }
  
      return { success: true, message: "Page deleted successfully!" };
    } catch (error: unknown) {
      console.error("Database error deleting multi-page set:", error);
      return { success: false, message: "Database error occurred." };
    }
  }

  // Fetch a single page by its ID for the edit form
export async function getMultiPageSetById(id: number) {
    const session = await auth();
    if (!session?.user?.id) return null;
  
    try {
      const set = await db.query.multiPageSets.findFirst({
        where: and(eq(multiPageSets.id, id), eq(multiPageSets.userId, session.user.id)),
        with: {
          items: {
            orderBy: [asc(multiPageItems.sortOrder)],
          },
        },
      });
      return set ?? null;
    } catch (error) {
      console.error("Error fetching multi-page set:", error);
      return null;
    }
  }
  
  // Update the title and links for a specific page
  export async function updateMultiPageSet(
    id: number, 
    title: string, 
    links: { label: string; url: string }[],
    colors: {
      backgroundColor: string;
      buttonColor: string;
      buttonHoverColor: string;
      textColor: string;
    }
  ) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Not authenticated." };
  
    if (links.length > 10) {
      return { success: false, message: "You can only add up to 10 links." };
    }
  
    try {
      const [updatedSet] = await db
        .update(multiPageSets)
        .set({ 
          title, 
          backgroundColor: colors.backgroundColor,
          buttonColor: colors.buttonColor,
          buttonHoverColor: colors.buttonHoverColor,
          textColor: colors.textColor,
          updatedAt: new Date() 
        })
        .where(and(eq(multiPageSets.id, id), eq(multiPageSets.userId, session.user.id)))
        .returning();
  
      if (!updatedSet) return { success: false, message: "Page not found or unauthorized." };
  
      await db.delete(multiPageItems).where(eq(multiPageItems.setId, id));
  
      if (links.length > 0) {
        const itemsToInsert = links.map((link, index) => ({
          setId: id,
          label: link.label,
          url: link.url,
          sortOrder: index,
        }));
        await db.insert(multiPageItems).values(itemsToInsert);
      }
  
      return { success: true, message: "Page updated successfully!" };
    } catch (error) {
      console.error("Database error updating multi-page set:", error);
      return { success: false, message: "Database error occurred." };
    }
  }