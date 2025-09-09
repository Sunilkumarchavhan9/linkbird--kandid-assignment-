import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campaigns } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({} as any));
        const count = Math.max(500, Math.min(Number(body?.count ?? 600), 2000));
        const ownerId = typeof body?.ownerId === "string" ? body.ownerId : null;

        const statuses = ["draft","active","paused","completed"] as const;

        const values: any[] = [];
        for (let i = 0; i < count; i++) {
            const idx = i + 1;
            const name = `Campaign ${idx.toString().padStart(3,"0")}`;
            const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
            const totalLeads = Math.floor(Math.random() * 120) + 1; // 1..120
            const successfulLeads = Math.floor(totalLeads * Math.random());
            const pastDays = Math.floor(Math.random() * 180); // within 6 months
            values.push({
                name,
                status,
                ownerId: ownerId ?? null,
                totalLeads,
                successfulLeads,
                createdAt: sql`NOW() - INTERVAL '${pastDays} days'`,
            });
        }

        await db.insert(campaigns).values(values);
        return NextResponse.json({ ok: true, created: values.length });
    } catch (e) {
        return NextResponse.json({ error: "seed_failed" }, { status: 500 });
    }
}


