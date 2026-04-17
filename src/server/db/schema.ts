// src/server/db/schema.ts
import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const createTable = pgTableCreator((name) => `qrgen_${name}`);

// --- Auth.js Schema ---
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
    expires_at: integer("expires_at"),
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
  data: text("data").notNull(),
  type: varchar("type", { length: 50, enum: qrCodeTypeEnum }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  foregroundColor: varchar("foreground_color", { length: 7 }).default("#000000").notNull(),
  backgroundColor: varchar("background_color", { length: 7 }).default("#FFFFFF").notNull(),
  isDynamic: boolean("is_dynamic").default(false).notNull(),
  shortCode: varchar("short_code", { length: 255 }).unique(),
  targetUrl: text("target_url"),
  scanCount: integer("scan_count").default(0).notNull(),
});

// --- Multi-Page Features ---
export const multiPageSets = createTable("multi_page_sets", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  shortCode: varchar("short_code", { length: 255 }).unique().notNull(),
  backgroundColor: varchar("background_color", { length: 7 }).default("#F9FAFB").notNull(),
  buttonColor: varchar("button_color", { length: 7 }).default("#FFFFFF").notNull(),
  buttonHoverColor: varchar("button_hover_color", { length: 7 }).default("#4F46E5").notNull(),
  textColor: varchar("text_color", { length: 7 }).default("#111827").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const multiPageItems = createTable("multi_page_items", {
  id: serial("id").primaryKey(),
  setId: integer("set_id")
    .notNull()
    .references(() => multiPageSets.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 255 }).notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// --- Relationships ---
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  qrCodes: many(qrCodes),
  multiPageSets: many(multiPageSets), 
}));

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
  user: one(users, {
    fields: [qrCodes.userId],
    references: [users.id],
  }),
}));

export const multiPageSetsRelations = relations(multiPageSets, ({ one, many }) => ({
  user: one(users, {
    fields: [multiPageSets.userId],
    references: [users.id],
  }),
  items: many(multiPageItems),
}));

export const multiPageItemsRelations = relations(multiPageItems, ({ one }) => ({
  set: one(multiPageSets, {
    fields: [multiPageItems.setId],
    references: [multiPageSets.id],
  }),
}));

// --- Type Exports ---
export type QRCode = typeof qrCodes.$inferSelect;
export type NewQRCode = typeof qrCodes.$inferInsert;
export type MultiPageSet = typeof multiPageSets.$inferSelect;
export type NewMultiPageSet = typeof multiPageSets.$inferInsert;
export type MultiPageItem = typeof multiPageItems.$inferSelect;
export type NewMultiPageItem = typeof multiPageItems.$inferInsert;