import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await ctx.params; 
    const id = Number(idStr);
    if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const companies = ["Gynoveda","Digi Sidekick","The Skin Story","PokoNut","Re'equil","Minimalist"];
    const campaignsMap = { 1: "Gynoveda Outreach", 2: "Digi Sidekick Launch", 3: "Retention Q3" } as const;
    const company = companies[id % companies.length];
    const campaignId = (id % 3) + 1 as 1|2|3;
    const name = `Lead ${id}`;
    const email = `lead${id}@${company.toLowerCase().replace(/[^a-z]/g,'')}.test`;
    const status = ["pending","contacted","responded","converted"][id % 4];
    const profile = {
        id,
        name,
        email,
        company,
        campaignId,
        campaignName: campaignsMap[campaignId],
        status,
        headline: "Building Product-led SEO Growth | Fintech / Edtech",
        website: "https://example.com",
        additional: {
            name: "Jivesh Lakhani",
            email: "ljivesh@gmail.com",
        },
        actions: [
            { title: "Invitation Request", description: "Message: Hi, I'm building consultative outreach …", time: "7 mins ago" },
            { title: "Connection Status", description: "Check connection status", time: "" },
            { title: "Connection Acceptance Message", description: "Message: Awesome to connect!", time: "" },
            { title: "Follow-up 1", description: "Did you get a chance to go through …", time: "10 mins ago" },
            { title: "Follow-up 2", description: "Just following up on my previous message …", time: "" },
        ],
    };
    return NextResponse.json(profile);
}


