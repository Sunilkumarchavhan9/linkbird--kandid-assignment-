import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campaigns } from "@/lib/db/schema";
import { CampaignsQuerySchema } from "@/lib/types/campaigns";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
    // If no database URL, return mock data
    if (!process.env.DATABASE_URL) {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const cursor = parseInt(searchParams.get("cursor") || "0");
        const status = searchParams.get("status");
        
        // Generate 1000+ mock campaigns
        const campaignNames = [
            "Summer Campaign 2024", "Product Launch", "Holiday Special", "Black Friday Sale",
            "New Year Campaign", "Valentine's Day", "Spring Collection", "Summer Sale",
            "Back to School", "Halloween Special", "Christmas Campaign", "Winter Collection",
            "Easter Promotion", "Mother's Day", "Father's Day", "Independence Day",
            "Labor Day Sale", "Thanksgiving Special", "Cyber Monday", "Year End Clearance",
            "Tech Innovation", "Fashion Forward", "Health & Wellness", "Fitness Challenge",
            "Beauty Revolution", "Skincare Essentials", "Hair Care", "Makeup Mastery",
            "Fragrance Collection", "Luxury Items", "Budget Friendly", "Premium Quality",
            "Eco Friendly", "Sustainable Living", "Organic Products", "Natural Beauty",
            "Digital Marketing", "Social Media", "Email Campaign", "Content Marketing",
            "SEO Optimization", "PPC Campaign", "Influencer Marketing", "Affiliate Program",
            "Customer Retention", "Loyalty Program", "Referral Bonus", "Welcome Offer",
            "Flash Sale", "Limited Time", "Exclusive Deal", "Member Only",
            "Early Bird", "Pre Order", "Launch Special", "Anniversary Sale"
        ];
        
        const statuses = ["active", "draft", "completed", "paused"];
        const totalCampaigns = 1000;
        const startId = cursor || 1;
        const endId = Math.min(startId + limit, totalCampaigns);
        
        const mockCampaigns = [];
        for (let i = startId; i <= endId; i++) {
            const name = campaignNames[i % campaignNames.length] + ` ${Math.floor(i / campaignNames.length) + 1}`;
            const campaignStatus = statuses[i % statuses.length];
            const totalLeads = Math.floor(Math.random() * 500) + 50;
            const successfulLeads = Math.floor(totalLeads * (Math.random() * 0.6 + 0.1));
            const responseRate = totalLeads ? Math.round((successfulLeads / totalLeads) * 100) : 0;
            
            // Filter by status if specified
            if (status && campaignStatus !== status) continue;
            
            mockCampaigns.push({
                id: i,
                name,
                status: campaignStatus,
                ownerId: "user-1",
                totalLeads,
                successfulLeads,
                createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                responseRate,
            });
        }

        const nextCursor = endId < totalCampaigns ? endId + 1 : null;
        return NextResponse.json({ 
            items: mockCampaigns, 
            nextCursor 
        });
    }

    const { searchParams } = new URL(req.url);
    const parsed = CampaignsQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    const { search, status, sort, order, userId, limit = 20, cursor } = parsed.data as any;

    const conditions = [
        status ? eq(campaigns.status, status) : undefined,
        search ? ilike(campaigns.name, `%${search}%`) : undefined,
        userId ? eq(campaigns.ownerId, userId) : undefined,
    ].filter(Boolean) as any[];

    const sortExpr =
        sort === "name"
            ? campaigns.name
            : sort === "successRate"
            ? sql`CASE WHEN ${campaigns.totalLeads} = 0 THEN 0 ELSE (${campaigns.successfulLeads}::float / ${campaigns.totalLeads}) END`
            : campaigns.createdAt;

    if (cursor) {
        
        conditions.push(order === "asc" ? sql`${campaigns.id} > ${cursor}` : sql`${campaigns.id} < ${cursor}`);
    }

    const rows = await db
        .select({
            id: campaigns.id,
            name: campaigns.name,
            status: campaigns.status,
            ownerId: campaigns.ownerId,
            totalLeads: campaigns.totalLeads,
            successfulLeads: campaigns.successfulLeads,
            createdAt: campaigns.createdAt,
        })
        .from(campaigns)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(order === "asc" ? asc(sortExpr) : desc(sortExpr))
        .limit(limit + 1);

    const hasMore = rows.length > limit;
    const pageRows = rows.slice(0, limit);

    const items = pageRows.map((c) => ({
        ...c,
        responseRate: c.totalLeads ? Math.round((c.successfulLeads / c.totalLeads) * 100) : 0,
    }));

    const nextCursor = hasMore ? pageRows[pageRows.length - 1]?.id : null;

    return NextResponse.json({ items, nextCursor });
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({} as any));
    const name = (body?.name ?? "").trim();
    const ownerId = typeof body?.ownerId === "string" ? body.ownerId : undefined;
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    
    // If no database URL, return mock response
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ id: Math.floor(Math.random() * 1000) + 100 });
    }
    
    const [row] = await db
        .insert(campaigns)
        .values({ name, status: "draft", ownerId })
        .returning({ id: campaigns.id });
    return NextResponse.json({ id: row.id });
}


