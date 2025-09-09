"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CampaignListItem, CampaignStatus } from "@/lib/types/campaigns";

type Filters = {
    search?: string;
    status?: CampaignStatus;
    sort?: "createdAt" | "name" | "successRate";
    order?: "asc" | "desc";
    userId?: string;
};

export default function CampaignsTable() {
    const [filters, setFilters] = useState<Filters>({ sort: "createdAt", order: "desc" });
    const me = useQuery<{ user?: { id: string } }>({
        queryKey: ["auth-session"],
        queryFn: async () => {
            const res = await fetch("/api/auth/session");
            if (!res.ok) return {} as any;
            return res.json();
        },
    });

    useEffect(() => {
        const id = me.data?.user?.id;
        if (id && filters.userId !== id) {
            setFilters((f) => ({ ...f, userId: id }));
        }
    }, [me.data?.user?.id]);
    const limit = 20;
    const campaignsQuery = useInfiniteQuery({
        queryKey: ["campaigns", filters, limit],
        initialPageParam: undefined as number | undefined,
        queryFn: async ({ pageParam }: { pageParam?: number }) => {
            const params = new URLSearchParams();
            params.set("limit", String(limit));
            if (pageParam) params.set("cursor", String(pageParam));
            if (filters.search) params.set("search", filters.search);
            if (filters.status) params.set("status", filters.status);
            if (filters.sort) params.set("sort", filters.sort);
            if (filters.order) params.set("order", filters.order);
            if (filters.userId) params.set("userId", filters.userId);
            const res = await fetch(`/api/campaigns?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to load campaigns");
            return res.json();
        },
        getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
    });

    const items = useMemo<CampaignListItem[]>(
        () => (campaignsQuery.data as any)?.pages?.flatMap((p: any) => p.items) ?? [],
        [campaignsQuery.data]
    );

    const dedupedItems = useMemo(() => {
        const seen = new Set<number>();
        return items.filter((it: CampaignListItem) => {
            if (seen.has(it.id)) return false;
            seen.add(it.id);
            return true;
        });
    }, [items]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const el = containerRef.current as HTMLDivElement | null;
        if (!el) return;
        const onScroll = () => {
            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 120;
            if (nearBottom && campaignsQuery.hasNextPage && !campaignsQuery.isFetchingNextPage) {
                campaignsQuery.fetchNextPage();
            }
        };
        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, [campaignsQuery.hasNextPage, campaignsQuery.isFetchingNextPage]);

    

    return (
        <div className="space-y-4">
            <motion.div
                className="flex gap-2 flex-wrap items-center"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <input
                    className="h-9 w-64 rounded-md border bg-background px-3 text-sm"
                    placeholder="Search campaigns..."
                    value={filters.search ?? ""}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                />
                <div className="flex items-center gap-2">
                    {[
                        { label: "All", value: "" },
                        { label: "Active", value: "active" },
                        { label: "Paused", value: "paused" },
                        { label: "Draft", value: "draft" },
                        { label: "Completed", value: "completed" },
                    ].map((opt) => (
                        <motion.button
                            key={opt.label}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFilters((f) => ({ ...f, status: (opt.value || undefined) as any }))}
                            className={`relative h-9 rounded-full border px-3 text-sm ${
                                (filters.status ?? "") === opt.value ? "bg-accent" : ""
                            }`}
                        >
                            {opt.label}
                            {(filters.status ?? "") === opt.value && (
                                <motion.span
                                    layoutId="tab-underline"
                                    className="absolute left-2 right-2 -bottom-[2px] h-[2px] rounded-full bg-primary"
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
                <select
                    className="h-9 rounded-md border bg-background px-3 text-sm"
                    value={filters.sort}
                    onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as any }))}
                >
                    <option value="createdAt">Created</option>
                    <option value="name">Name</option>
                    <option value="successRate">Success Rate</option>
                </select>
                <select
                    className="h-9 rounded-md border bg-background px-3 text-sm"
                    value={filters.order}
                    onChange={(e) => setFilters((f) => ({ ...f, order: e.target.value as any }))}
                >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                </select>
                <button
                    className="ml-auto h-9 rounded-md border bg-primary/90 text-white px-3 text-sm hover:bg-primary"
                    onClick={async () => {
                        const name = prompt("Campaign name?")?.trim();
                        if (!name) return;
                        const body: any = { name };
                        if (filters.userId) body.ownerId = filters.userId;
                        const res = await fetch(`/api/campaigns`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
                        if (res.ok) campaignsQuery.refetch();
                    }}
                >
                    Create Campaign
                </button>
                
            </motion.div>

            <div className="rounded-lg border overflow-hidden max-h-[70vh] overflow-y-auto no-scrollbar" ref={containerRef}>
                <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0 z-10">
                        <tr className="text-left">
                            <th className="p-3">Campaign</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Total Leads</th>
                            <th className="p-3">Successful</th>
                            <th className="p-3">Response Rate</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaignsQuery.isLoading && Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-3"><div className="h-4 w-40 bg-muted animate-pulse rounded" /></td>
                                <td className="p-3"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
                                <td className="p-3"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                                <td className="p-3"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                                <td className="p-3"><div className="h-2 w-40 bg-muted animate-pulse rounded" /></td>
                                <td className="p-3"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
                                <td className="p-3"><div className="h-6 w-32 bg-muted animate-pulse rounded" /></td>
                            </tr>
                        ))}
                        <AnimatePresence initial={false}>
                            {dedupedItems.map((c: CampaignListItem, index: number) => (
                                <motion.tr
                                    key={c.id}
                                    className="border-t hover:bg-accent/40 cursor-pointer"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => {
                                        window.location.href = `/campaigns/${c.id}`;
                                    }}
                                >
                                    <td className="p-3 font-medium">{c.name}</td>
                                    <td className="p-3 capitalize">{c.status}</td>
                                    <td className="p-3">{c.totalLeads}</td>
                                    <td className="p-3">{c.successfulLeads}</td>
                                    <td className="p-3">
                                        <div className="w-40 h-2 rounded bg-muted">
                                            <motion.div
                                                className="h-2 rounded bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${c.responseRate}%` }}
                                                transition={{ delay: 0.15 + index * 0.02 }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{c.responseRate}%</span>
                                    </td>
                                    <td className="p-3">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <Actions id={c.id} status={c.status} onDone={() => campaignsQuery.refetch()} />
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {campaignsQuery.isFetching && (
                            <tr>
                                <td className="p-3 text-center text-muted-foreground" colSpan={6}>Loading…</td>
                            </tr>
                        )}
                        {campaignsQuery.isError && (
                            <tr>
                                <td className="p-3 text-center text-red-600" colSpan={7}>Failed to load campaigns. Please retry.</td>
                            </tr>
                        )}
                        {!campaignsQuery.isLoading && !campaignsQuery.hasNextPage && items.length === 0 && (
                            <tr>
                                <td className="p-3 text-center text-muted-foreground" colSpan={7}>No campaigns found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {campaignsQuery.hasNextPage && (
                    <div className="p-3 border-t bg-background text-center">
                        <button
                            className="inline-flex items-center justify-center h-9 rounded-md border px-3 text-sm hover:bg-accent"
                            onClick={() => campaignsQuery.fetchNextPage()}
                            disabled={campaignsQuery.isFetchingNextPage}
                        >
                            {campaignsQuery.isFetchingNextPage ? "Loading…" : "Load more"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Actions({ id, status, onDone }: { id: number; status: CampaignStatus; onDone: () => void }) {
    const [loading, setLoading] = useState(false);

    async function toggle() {
        setLoading(true);
        await fetch(`/api/campaigns/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "toggle" }) });
        setLoading(false);
        onDone();
    }

    async function remove() {
        setLoading(true);
        await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
        setLoading(false);
        onDone();
    }

    async function rename() {
        const name = prompt("New campaign name?")?.trim();
        if (!name) return;
        setLoading(true);
        await fetch(`/api/campaigns/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
        setLoading(false);
        onDone();
    }

    const resume = status === "paused";
    return (
        <div className="flex items-center gap-2">
            <button
                className="inline-flex items-center gap-1 text-xs rounded-md px-2 py-1 border hover:bg-accent"
                onClick={rename}
                disabled={loading}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M16 3a2 2 0 0 1 2 2v8l-4 4H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8z" stroke="currentColor" strokeWidth="1.6"/></svg>
                Edit
            </button>
            <button
                className={`inline-flex items-center gap-1 text-xs rounded-md px-2 py-1 border ${resume ? "text-green-600 hover:bg-green-500/10 border-green-300/60" : "text-amber-600 hover:bg-amber-500/10 border-amber-300/60"}`}
                onClick={toggle}
                disabled={loading}
            >
                {resume ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6v12M14 6v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                )}
                {resume ? "Resume" : "Pause"}
            </button>
            <button
                className="inline-flex items-center gap-1 text-xs rounded-md px-2 py-1 border text-red-600 hover:bg-red-500/10 border-red-300/60"
                onClick={remove}
                disabled={loading}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 7l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7m3 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-9 0h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Delete
            </button>
        </div>
    );
}


