"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUiStore } from "@/lib/state/ui";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Megaphone, Settings } from "lucide-react";

const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leads", label: "Leads", icon: Users },
    { href: "/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/profile", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isSidebarCollapsed, toggleSidebar } = useUiStore();
    const me = useQuery<{ user?: { name?: string; email?: string; image?: string } }>({
        queryKey: ["auth-session"],
        queryFn: async () => {
            const res = await fetch("/api/auth/session");
            if (!res.ok) return {} as any;
            return res.json();
        },
    });
    const user = me.data?.user ?? {} as any;

    return (
        <aside
            className={cn(
                "border-r bg-card/50 backdrop:blur-sm flex flex-col",
                isSidebarCollapsed ? "w-[72px]" : "w-64"
            )}
        >
            <div className="h-14 flex items-center justify-between px-3">
                <span className={cn("font-semibold", isSidebarCollapsed && "sr-only")}>
                    <img src="/linkbird-light-logo.svg" alt="Linkbird" className="h-5 drop-shadow-lg" />
                </span>
                <button
                    className="rounded-md p-2 hover:bg-accent"
                    aria-label="Toggle sidebar"
                    onClick={toggleSidebar}
                >
                    <svg data-testid="geist-icon" height="16" strokeLinejoin="round" style={{ color: "currentColor" }} viewBox="0 0 16 16" width="16">
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.005 2.5H14.5V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H11.005L11.005 2.5ZM9.75501 2.5H1.5V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H9.755L9.75501 2.5ZM0 1H1.5H14.5H16V2.5V12.5C16 13.8807 14.8807 15 13.5 15H2.5C1.11929 15 0 13.8807 0 12.5V2.5V1Z" fill="currentColor" />
                    </svg>
                </button>
            </div>
            <nav className="px-2 py-2 space-y-1">
                {nav.map((item) => {
                    const Icon = item.icon;
                    const active = pathname?.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                                active
                                    ? "bg-accent text-accent-foreground shadow-sm drop-shadow"
                                    : "hover:bg-accent/60 hover:shadow-sm"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span className={cn(isSidebarCollapsed && "hidden")}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto border-t p-3">
                <Link href="/profile" className={cn("flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent/60 transition-colors", isSidebarCollapsed && "justify-center")}> 
                    { (user.image || "/sunil.jpg") ? (
                        <img src={user.image || "/sunil.jpg"} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {(user.name ?? "U").split(" ").map((n: string) => n[0]).filter(Boolean).slice(0,2).join("").toUpperCase()}
                        </div>
                    )}
                    <div className={cn("min-w-0", isSidebarCollapsed && "hidden")}> 
                        <div className="truncate text-sm font-medium">{user.name ?? "Your Name"}</div>
                        <div className="truncate text-xs text-muted-foreground">{user.email ?? "you@example.com"}</div>
                    </div>
                </Link>
            </div>
        </aside>
    );
}


