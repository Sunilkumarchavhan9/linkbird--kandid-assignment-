import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campaigns } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = await req.json().catch(() => ({}));
    
    if (body?.action === "toggle") {
        const current = await db.select({ status: campaigns.status }).from(campaigns).where(eq(campaigns.id, idNum)).limit(1);
        if (!current.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
        const next = current[0].status === "paused" ? "active" : "paused" as const;
        await db.update(campaigns).set({ status: next }).where(eq(campaigns.id, idNum));
        return NextResponse.json({ ok: true, status: next });
    }
    if (typeof body?.name === "string" && body.name.trim().length > 0) {
        await db.update(campaigns).set({ name: body.name.trim() }).where(eq(campaigns.id, idNum));
        return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unsupported operation" }, { status: 400 });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await db.delete(campaigns).where(eq(campaigns.id, idNum));
    return NextResponse.json({ ok: true });
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    
    // If no database URL, return mock data
    if (!process.env.DATABASE_URL) {
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
        const name = campaignNames[idNum % campaignNames.length] + ` ${Math.floor(idNum / campaignNames.length) + 1}`;
        const status = statuses[idNum % statuses.length];
        const total = Math.floor(Math.random() * 500) + 50;
        const success = Math.floor(total * (Math.random() * 0.6 + 0.1));
        const requestsSent = Math.round(total * 0.8);
        const requestsAccepted = Math.round(success * 0.6);
        const requestsReplied = Math.round(success * 0.4);
        const leadsContactedPct = Math.min(100, Math.round((requestsSent / Math.max(total, 1)) * 100));
        const acceptanceRate = Math.min(100, Math.round((requestsAccepted / Math.max(requestsSent, 1)) * 100));
        const replyRate = Math.min(100, Math.round((requestsReplied / Math.max(requestsSent, 1)) * 100));
        const conversionRate = Math.min(100, Math.round((success / Math.max(total, 1)) * 100));

        return NextResponse.json({
            id: idNum,
            name,
            status,
            totalLeads: total,
            successfulLeads: success,
            startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            requestsSent,
            requestsAccepted,
            requestsReplied,
            leadsContactedPct,
            acceptanceRate,
            replyRate,
            conversionRate,
        });
    }
    
    const row = await db.query.campaigns.findFirst({
        where: eq(campaigns.id, idNum),
        columns: {
            id: true,
            name: true,
            status: true,
            totalLeads: true,
            successfulLeads: true,
            createdAt: true,
        },
    });
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const total = row.totalLeads ?? 0;
    const success = row.successfulLeads ?? 0;
    const requestsSent = Math.round(total * 0.8);
    const requestsAccepted = Math.round(success * 0.6);
    const requestsReplied = Math.round(success * 0.4);
    const leadsContactedPct = Math.min(100, Math.round((requestsSent / Math.max(total, 1)) * 100));
    const acceptanceRate = Math.min(100, Math.round((requestsAccepted / Math.max(requestsSent, 1)) * 100));
    const replyRate = Math.min(100, Math.round((requestsReplied / Math.max(requestsSent, 1)) * 100));
    const conversionRate = Math.min(100, Math.round((success / Math.max(total, 1)) * 100));

    return NextResponse.json({
        id: row.id,
        name: row.name,
        status: row.status,
        totalLeads: total,
        successfulLeads: success,
        startDate: row.createdAt,
        requestsSent,
        requestsAccepted,
        requestsReplied,
        leadsContactedPct,
        acceptanceRate,
        replyRate,
        conversionRate,
    });
}


