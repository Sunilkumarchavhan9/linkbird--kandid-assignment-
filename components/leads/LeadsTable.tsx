"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeadDetailSheet from "@/components/leads/LeadDetailSheet";
import { LeadStatus, LeadListItem } from "@/lib/types/leads";

type Filters = {
    search?: string;
    status?: LeadStatus;
};

export default function LeadsTable() {
    const [filters, setFilters] = useState<Filters>({});

    const query = useInfiniteQuery({
        queryKey: ["leads", filters],
        initialPageParam: undefined as number | undefined,
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();
            params.set("limit", "20");
            if (pageParam) params.set("cursor", String(pageParam));
            if (filters.search) params.set("search", filters.search);
            if (filters.status) params.set("status", filters.status);
            const res = await fetch(`/api/leads?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to load leads");
            return res.json();
        },
        getNextPageParam: (lastPage: any) => (lastPage?.nextCursor ?? undefined),
    });

    const items = useMemo(() => (query.data as any)?.pages?.flatMap((p: any) => p.items) ?? [], [query.data]);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 200;
            if (nearBottom && query.hasNextPage && !query.isFetchingNextPage) {
                query.fetchNextPage();
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [query.hasNextPage, query.isFetchingNextPage]);

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input
                    className="h-9 w-64 rounded-md border bg-background px-3 text-sm"
                    placeholder="Search leads..."
                    value={filters.search ?? ""}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                />
                <select
                    className="h-9 rounded-md border bg-background px-3 text-sm"
                    value={filters.status ?? ""}
                    onChange={(e) => setFilters((f) => ({ ...f, status: (e.target.value || undefined) as any }))}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="responded">Responded</option>
                    <option value="converted">Converted</option>
                </select>
            </div>

            <div className="rounded-lg border overflow-hidden max-h-[70vh] overflow-y-auto no-scrollbar">
                <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0 z-10">
                        <tr className="text-left">
                            <th className="p-3">Name</th>
                            <th className="p-3">Campaign Name</th>
                            <th className="p-3">Activity</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {query.isLoading && Array.from({ length: 6 }).map((_, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-3"><div className="h-4 w-56 bg-muted animate-pulse rounded" /></td>
                                <td className="p-3"><div className="h-4 w-40 bg-muted animate-pulse rounded" /></td>
                                <td className="p-3"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                                <td className="p-3"><div className="h-4 w-32 bg-muted animate-pulse rounded" /></td>
                            </tr>
                        ))}
                        <AnimatePresence initial={false}>
                            {items.map((l: LeadListItem) => (
                                <motion.tr
                                    key={l.id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="border-t hover:bg-accent/40 cursor-pointer"
                                    onClick={() => { setActiveId(l.id); setOpen(true); }}
                                >
                                    <RowCells lead={l} />
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {query.isFetching && (
                            <tr>
                                <td className="p-3 text-center text-muted-foreground" colSpan={4}>Loading…</td>
                            </tr>
                        )}
                        {query.isError && (
                            <tr>
                                <td className="p-3 text-center text-red-600" colSpan={4}>Failed to load leads. Please retry.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <LeadDetailSheet id={activeId} open={open} onOpenChange={setOpen} />
        </div>
    );
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function statusPill(status: LeadStatus): { text: string; className: string } {
    switch (status) {
        case "pending":
            return { text: "Pending Approval", className: "bg-purple-500/10 text-purple-700" };
        case "contacted":
            return { text: "Sent 7 mins ago", className: "bg-amber-500/10 text-amber-700" };
        case "responded":
            return { text: "Followup 10 mins ago", className: "bg-blue-500/10 text-blue-700" };
        case "converted":
            return { text: "Connected", className: "bg-green-500/10 text-green-700" };
        default:
            return { text: status, className: "bg-muted text-foreground" } as any;
    }
}

function ActivityBars({ status }: { status: LeadStatus }) {
    const color =
        status === "pending" ? "bg-gray-300" :
        status === "contacted" ? "bg-amber-400" :
        status === "responded" ? "bg-blue-500" :
        "bg-purple-500";

    return (
        <div className="flex items-center gap-1">
            <div className={`h-5 w-1.5 rounded ${color} opacity-60`} />
            <div className={`h-5 w-1.5 rounded ${color} opacity-80`} />
            <div className={`h-5 w-1.5 rounded ${color} opacity-100`} />
        </div>
    );
}

function RowCells({ lead }: { lead: LeadListItem }) {
    const pill = statusPill(lead.status);
    return (
        <>
            <td className="p-3">
                <div className="flex items-center gap-3">
                    <motion.div layoutId={`avatar-${lead.id}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {getInitials(lead.name)}
                    </motion.div>
                    <div className="min-w-0">
                        <div className="truncate font-medium">{lead.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{lead.email}</div>
                    </div>
                </div>
            </td>
            <td className="p-3 text-muted-foreground">{lead.campaignName}</td>
            <td className="p-3"><ActivityBars status={lead.status} /></td>
            <td className="p-3">
                <motion.span layout className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${pill.className}`}>
                    {pill.text}
                </motion.span>
            </td>
        </>
    );
}


