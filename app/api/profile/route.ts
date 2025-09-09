import { NextRequest, NextResponse } from "next/server";

const COOKIE = "demo_profile";

export async function GET(req: NextRequest) {
    const raw = req.cookies.get(COOKIE)?.value;
    const data = raw ? safeParse(raw) : {};
    return NextResponse.json({ user: data });
}

export async function PATCH(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const raw = req.cookies.get(COOKIE)?.value;
    const prev = raw ? safeParse(raw) : {};
    const next = { ...prev, ...body } as any;
    const res = NextResponse.json({ ok: true, user: next });
    res.cookies.set(COOKIE, JSON.stringify(next), { path: "/", httpOnly: false, sameSite: "lax" });
    return res;
}

function safeParse(s: string) {
    try { return JSON.parse(s); } catch { return {}; }
}


