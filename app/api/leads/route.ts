import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { leads, campaigns } from "@/lib/db/schema";
import { and, desc, eq, ilike, lt, sql } from "drizzle-orm";
import { LeadsQuerySchema } from "@/lib/types/leads";

export async function POST() {
  try {
    
    const desiredCampaigns = [
      { name: "Gynoveda Outreach", status: "active" as const },
      { name: "Digi Sidekick Launch", status: "active" as const },
      { name: "Retention Q3", status: "active" as const },
    ];

    for (const c of desiredCampaigns) {
      await db
        .insert(campaigns)
        .values(c)
        .onConflictDoNothing({ target: campaigns.name });
    }

    const campRows = await db.select({ id: campaigns.id, name: campaigns.name }).from(campaigns);
    const byName = Object.fromEntries(campRows.map((c) => [c.name, c.id]));

    const campaignBuckets: Array<{ id: number; size: number }> = [
      { id: byName["Gynoveda Outreach"], size: 70 },
      { id: byName["Digi Sidekick Launch"], size: 80 },
      { id: byName["Retention Q3"], size: 50 },
    ];
    const companies = [
      "Gynoveda",
      "Digi Sidekick",
      "The Skin Story",
      "PokoNut",
      "Re'equil",
      "Minimalist",
    ];

    const firstNames = [
      "Aarav","Vihaan","Vivaan","Aditya","Arjun","Sai","Krishna","Ishaan","Rudra","Kabir",
      "Ananya","Aadhya","Siya","Pari","Anika","Navya","Ahana","Ira","Myra","Aarohi",
    ];
    const lastNames = [
      "Sharma","Verma","Agarwal","Iyer","Menon","Reddy","Patel","Singh","Kumar","Das",
      "Bose","Ghosh","Nair","Naidu","Desai","Bhat","Khan","Gupta","Rao","Chatterjee",
    ];
    const statusPool = [
      ...Array(35).fill("pending"),
      ...Array(30).fill("contacted"),
      ...Array(20).fill("responded"),
      ...Array(15).fill("converted"),
    ] as ("pending"|"contacted"|"responded"|"converted")[];

    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    const values: any[] = [];
    for (const bucket of campaignBuckets) {
      for (let i = 0; i < bucket.size; i++) {
        const fn = pick(firstNames);
        const ln = pick(lastNames);
        const full = `${fn} ${ln}`;
        const company = pick(companies);
        const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, '')}.test`;
        const r = Math.random();
        const minutesAgo = r < 0.7 ? Math.floor(Math.random() * (48 * 60))
                      : r < 0.9 ? Math.floor(Math.random() * (14 * 24 * 60))
                                : Math.floor(Math.random() * (60 * 24 * 60));

        values.push({
          name: full,
          email,
          company,
          campaignId: bucket.id,
          status: pick(statusPool) as any,
          lastContactAt: sql`NOW() - INTERVAL '${minutesAgo} minutes'`,
        });
      }
    }

    

    await db.insert(leads).values(values);

    return NextResponse.json({ ok: true, created: values.length });
  } catch (e) {
    return NextResponse.json({ error: "seed_failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const companies = [
        "Gynoveda",
        "Digi Sidekick",
        "The Skin Story",
        "PokoNut",
        "Re'equil",
        "Minimalist",
    ];
    const campaignsMap = {
        1: "Gynoveda Outreach",
        2: "Digi Sidekick Launch",
        3: "Retention Q3",
    } as const;
    const firstNames = [
        "Aarav","Vihaan","Vivaan","Aditya","Arjun","Sai","Krishna","Ishaan","Rudra","Kabir",
        "Ananya","Aadhya","Siya","Pari","Anika","Navya","Ahana","Ira","Myra","Aarohi",
    ];
    const lastNames = [
        "Sharma","Verma","Agarwal","Iyer","Menon","Reddy","Patel","Singh","Kumar","Das",
        "Bose","Ghosh","Nair","Naidu","Desai","Bhat","Khan","Gupta","Rao","Chatterjee",
    ];
    const statusPool = [
        ...Array(35).fill("pending"),
        ...Array(30).fill("contacted"),
        ...Array(20).fill("responded"),
        ...Array(15).fill("converted"),
    ] as ("pending"|"contacted"|"responded"|"converted")[];
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    const campaignIdFilter = Number(new URL(req.url).searchParams.get("campaignId") || "0") || undefined;
    const items = Array.from({ length: 500 }).map((_, idx) => {
        const id = 2000 - idx; 
        const company = companies[idx % companies.length];
        const campaignId = (idx % 3) + 1 as 1 | 2 | 3;
        const fn = pick(firstNames);
        const ln = pick(lastNames);
        const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, '')}.test`;
        const r = Math.random();
        const minutesAgo = r < 0.7 ? Math.floor(Math.random() * (48 * 60))
                      : r < 0.9 ? Math.floor(Math.random() * (14 * 24 * 60))
                                : Math.floor(Math.random() * (60 * 24 * 60));
        return {
            id,
            name: `${fn} ${ln}`,
            email,
            company,
            campaignId,
            campaignName: campaignsMap[campaignId],
            status: pick(statusPool),
            lastContactAt: new Date(Date.now() - minutesAgo * 60 * 1000),
            createdAt: new Date(),
        };
    });

    let filtered = items;
    if (campaignIdFilter) {
        filtered = items.map((i) => ({
            ...i,
            campaignId: (campaignIdFilter % 3 || 1) as 1|2|3,
            campaignName: ["Gynoveda Outreach","Digi Sidekick Launch","Retention Q3"][(campaignIdFilter % 3 || 1) - 1] as any,
        }));
    }

    return NextResponse.json({ items: filtered, nextCursor: null });
}


