import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // Temporarily disable authentication for demo purposes
    // Allow all routes to be accessed without login
    return NextResponse.next();
    
    // Original authentication logic (commented out for demo)
    /*
    const publicDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isAppRoute = req.nextUrl.pathname.startsWith("/leads") || req.nextUrl.pathname.startsWith("/campaigns") || req.nextUrl.pathname.startsWith("/settings");
    if (publicDashboard || !isAppRoute) return NextResponse.next();

    const session =
        req.cookies.get("better-auth.session_token")?.value ??
        req.cookies.get("better-auth.session-token")?.value;
    if (!session) {
        const url = new URL("/login", req.url);
        url.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
    */
}

export const config = {
    matcher: ["/dashboard/:path*", "/leads/:path*", "/campaigns/:path*", "/settings/:path*"],
};


