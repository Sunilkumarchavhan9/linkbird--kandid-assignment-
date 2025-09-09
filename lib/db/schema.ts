import { pgTable, serial, text, timestamp, integer, pgEnum, index } from "drizzle-orm/pg-core";

export const campaignStatusEnum = pgEnum("campaign_status", [
    "draft",
    "active",
    "paused",
    "completed",
]);

export const leadStatusEnum = pgEnum("lead_status", [
    "pending",
    "contacted",
    "responded",
    "converted",
]);

export const campaigns = pgTable("campaigns", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    status: campaignStatusEnum("status").notNull().default("draft"),
    ownerId: text("owner_id"),
    totalLeads: integer("total_leads").notNull().default(0),
    successfulLeads: integer("successful_leads").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
    idxStatus: index("campaigns_status_idx").on(t.status),
    idxOwner: index("campaigns_owner_id_idx").on(t.ownerId),
    idxCreated: index("campaigns_created_at_idx").on(t.createdAt),
}));

export const leads = pgTable("leads", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    campaignId: integer("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
    status: leadStatusEnum("status").notNull().default("pending"),
    lastContactAt: timestamp("last_contact_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
    idxCampaign: index("leads_campaign_id_idx").on(t.campaignId),
    idxStatus: index("leads_status_idx").on(t.status),
    idxCreated: index("leads_created_at_idx").on(t.createdAt),
}));


