import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campaigns } from "@/lib/db/schema";
import { CampaignsQuerySchema } from "@/lib/types/campaigns";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
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
    const [row] = await db
        .insert(campaigns)
        .values({ name, status: "draft", ownerId })
        .returning({ id: campaigns.id });
    return NextResponse.json({ id: row.id });
}


