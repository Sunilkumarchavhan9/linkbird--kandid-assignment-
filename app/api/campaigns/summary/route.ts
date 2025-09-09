import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campaigns } from "@/lib/db/schema";
import { and, count, eq, sum } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;

    const where = userId ? and(eq(campaigns.ownerId, userId)) : undefined as any;

    const [totals] = await db
        .select({
            campaigns: count(campaigns.id).as("campaigns"),
            totalLeads: sum(campaigns.totalLeads).as("totalLeads"),
            successfulLeads: sum(campaigns.successfulLeads).as("successfulLeads"),
        })
        .from(campaigns)
        .where(where);

    const total = Number(totals?.totalLeads ?? 0);
    const success = Number(totals?.successfulLeads ?? 0);
    const responseRate = total ? Math.round((success / total) * 100) : 0;

    return NextResponse.json({
        campaigns: Number(totals?.campaigns ?? 0),
        totalLeads: Number(totals?.totalLeads ?? 0),
        successfulLeads: Number(totals?.successfulLeads ?? 0),
        responseRate,
    });
}


