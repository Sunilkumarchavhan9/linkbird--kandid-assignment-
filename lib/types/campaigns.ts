import { z } from "zod";

export const CampaignStatusSchema = z.enum(["draft", "active", "paused", "completed"]);

export const CampaignsQuerySchema = z.object({
    search: z.string().max(100).optional(),
    status: CampaignStatusSchema.optional(),
    sort: z.enum(["createdAt", "name", "successRate"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
    userId: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    cursor: z.coerce.number().int().optional(),
});

export type CampaignStatus = z.infer<typeof CampaignStatusSchema>;
export type CampaignsQuery = z.infer<typeof CampaignsQuerySchema>;

export type CampaignListItem = {
    id: number;
    name: string;
    status: CampaignStatus;
    totalLeads: number;
    successfulLeads: number;
    responseRate: number;
    createdAt: string;
};


