import { pgTable, text, timestamp, primaryKey, boolean } from "drizzle-orm/pg-core";



export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified"),
  image: text("image"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  providerId: text("provider_id").notNull(),
  accountId: text("account_id").notNull(),
  password: text("password"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }),
  scope: text("scope"),
  tokenType: text("token_type"),
  idToken: text("id_token"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.identifier, t.token] }),
  })
);

export const user = users;
export const account = accounts;
export const session = sessions;
export const verificationToken = verificationTokens;


