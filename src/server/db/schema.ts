// src/server/db/schema.ts
import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  pgEnum, // Import pgEnum
  primaryKey, // Import primaryKey for compound keys
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the `pgTableCreator` helper.
 * It creates a new table creator with a custom `schema` feature that
 * protects against collisions in different schemas and databases.
 *
 * @see https://drizzle.team/docs/goodies#pgtablecreator
 */
export const createTable = pgTableCreator((name) => `qr_generator_${name}`);

// --- NextAuth.js Drizzle Schema (Keep as is, provided by T3 stack) ---
export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).$type<"oauth" | "oidc" | "email">().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: timestamp("expires_at", { mode: "date" }),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = createTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// --- QR Code Specific Schema ---
// Define an enum for QR code types
export const qrCodeTypeEnum = pgEnum("qr_code_type", ["text", "url", "email", "phone", "sms", "wifi"]);

export const qrCodes = createTable("qr_codes", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Link to the user who created it
  title: varchar("title", { length: 255 }), // Optional title for the QR code
  data: text("data").notNull(), // The actual content encoded in the QR code
  type: qrCodeTypeEnum("type").notNull().default("text"), // The type of data (e.g., 'url', 'text')
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

// Infer the type from the qrCodes table definition and export it
export type QRCode = typeof qrCodes.$inferSelect;
// Infer the insert type
export type NewQRCode = typeof qrCodes.$inferInsert;
