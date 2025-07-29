// src/server/db/schema.ts
import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  varchar,
  text,
  timestamp,
  integer, // Added for expires_at in accounts/sessions
  boolean, // For emailVerified
  primaryKey, // For combined primary keys
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; // For defining table relationships

/**
 * This is an example of how to use the `pgTableCreator` helper.
 *
 * `pgTableCreator` can no longer be a global variable due to a Drizzle bug
 * on the latest version and Next.js.
 *
 * @see https://github.com/drizzle-team/drizzle-orm/issues/1169
 */
export const createTable = pgTableCreator((name) => `qrgen_${name}`);

// --- Auth.js Schema (from next-auth/drizzle-adapter expectations) ---
// These tables are typically created and managed by DrizzleAdapter for NextAuth.js
export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
});

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"), // Changed from timestamp to integer
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
  sessionToken: varchar("sessionToken", { length: 255 })
    .notNull()
    .primaryKey(),
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

// --- Your Application Schema ---
export const qrCodeTypeEnum = [
  "text",
  "url",
  "email",
  "phone",
  "sms",
  "wifi",
] as const;

export const qrCodes = createTable("qr_codes", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  data: text("data").notNull(), // The actual content of the QR code
  type: varchar("type", { length: 50, enum: qrCodeTypeEnum }).notNull(), // Enum for QR code type
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Define relationships (optional, but good practice for findMany with relations)
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  qrCodes: many(qrCodes), // A user can have many QR codes
}));

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
  user: one(users, {
    fields: [qrCodes.userId],
    references: [users.id],
  }),
}));

// Infer types from Drizzle schema for use in application
export type QRCode = typeof qrCodes.$inferSelect;
export type NewQRCode = typeof qrCodes.$inferInsert;
