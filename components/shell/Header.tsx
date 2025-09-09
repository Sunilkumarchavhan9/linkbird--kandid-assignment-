"use client";

import Breadcrumbs from "@/components/shell/Breadcrumbs";
import { useTheme } from "next-themes";
import UserMenu from "@/components/auth/UserMenu";

export default function Header() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";
    const label = isDark ? "Switch to light mode" : "Switch to dark mode";

    return (
        <header className="h-14 border-b bg-background/60 backdrop:blur-sm flex items-center justify-between px-4">
            <Breadcrumbs />
            <div className="flex items-center gap-2">
                <button
                    aria-label={label}
                    title={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-colors duration-200"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                >
                    {isDark ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-foreground/80">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-foreground/80">
                            <circle cx="12" cy="12" r="4" stroke="currentColor" />
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" />
                        </svg>
                    )}
                </button>
                <UserMenu />
            </div>
        </header>
    );
}


