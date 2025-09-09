import { z } from "zod";

export const LeadStatusSchema = z.enum(["pending", "contacted", "responded", "converted"]);

export const LeadsQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    cursor: z.coerce.number().int().positive().optional(),
    search: z.string().max(100).optional(),
    status: LeadStatusSchema.optional(),
    campaignId: z.coerce.number().int().positive().optional(),
});

export type LeadStatus = z.infer<typeof LeadStatusSchema>;
export type LeadsQuery = z.infer<typeof LeadsQuerySchema>;

export type LeadListItem = {
    id: number;
    name: string;
    email: string;
    company: string | null;
    campaignId: number;
    campaignName: string;
    status: LeadStatus;
    lastContactAt: string | null;
    createdAt: string;
};


