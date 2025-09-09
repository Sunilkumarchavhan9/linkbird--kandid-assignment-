"use client";

import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname() || "/";
    const segments = pathname.split("/").filter(Boolean);

    return (
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
                <li>
                    <a href="/" className="hover:underline">Home</a>
                </li>
                {segments.map((seg, idx) => {
                    const href = "/" + segments.slice(0, idx + 1).join("/");
                    const isLast = idx === segments.length - 1;
                    return (
                        <li key={href} className="flex items-center gap-2">
                            <span>/</span>
                            {isLast ? (
                                <span className="font-medium text-foreground capitalize">{seg}</span>
                            ) : (
                                <a href={href} className="hover:underline capitalize">{seg}</a>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}


