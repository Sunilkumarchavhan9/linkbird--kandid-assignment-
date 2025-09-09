"use client";

import { PropsWithChildren, useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: PropsWithChildren) {
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        const handler = (event: any) => {
            if (event?.detail?.error) {
                console.warn("Request error:", event.detail.error);
            }
        };
        window.addEventListener("app:error", handler as any);
        return () => window.removeEventListener("app:error", handler as any);
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}


