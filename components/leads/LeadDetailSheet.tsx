"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

export default function LeadDetailSheet({ id, open, onOpenChange }: { id: number | null; open: boolean; onOpenChange: (v: boolean) => void; }) {
    const q = useQuery({
        queryKey: ["lead", id],
        queryFn: async () => {
            if (!id) return null;
            const res = await fetch(`/api/leads/${id}`);
            if (!res.ok) throw new Error("Failed to fetch lead");
            return res.json();
        },
        enabled: !!id && open,
    });

    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal forceMount>
                <AnimatePresence>
                    {open && (
                        <>
                            <motion.div
                                key="overlay"
                                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                            <motion.div
                                key="sheet"
                                className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-background border-l p-6 overflow-y-auto"
                                initial={{ x: 40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 40, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 360, damping: 30 }}
                            >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent"
                                aria-label="Back"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <Dialog.Title className="text-lg font-semibold">Lead Details</Dialog.Title>
                        </div>
                        <Dialog.Close className="rounded-md px-2 py-1 hover:bg-accent">✕</Dialog.Close>
                    </div>
                    {!q.data ? (
                        <div className="space-y-3">
                            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            
                            <section className="rounded-lg border p-4">
                                <div className="flex items-start gap-3">
                                    <motion.div layoutId={`avatar-${q.data.id}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                        {q.data.name?.split(" ").map((n: string) => n[0]).join("")}
                                    </motion.div>
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold leading-none truncate">{q.data.name}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground break-words">{q.data.headline}</p>
                                        <div className="flex flex-wrap items-center gap-2 pt-2">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M5 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" stroke="currentColor" strokeWidth="1.5"/></svg>
                                                {q.data.campaignName}
                                            </span>
                                            <motion.span layoutId={`status-${q.data.id}`} className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] capitalize">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                {q.data.status}
                                            </motion.span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 px-2 py-0.5 text-[11px]">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                                Sent 7 mins ago
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex shrink-0 items-start gap-2">
                                        <button
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent"
                                            title="Copy email"
                                            onClick={() => { navigator.clipboard.writeText(q.data.email ?? ""); }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="4" y="4" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>
                                        </button>
                                        <a
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent"
                                            title="Open website"
                                            href={q.data.website ?? "#"}
                                            target="_blank" rel="noreferrer"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M21 14v6a1 1 0 0 1-1 1h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                        </a>
                                    </div>
                                </div>
                            </section>

                            
                            <details className="rounded-lg border p-4">
                                <summary className="flex cursor-pointer items-center justify-between list-none">
                                    <span className="text-sm font-medium text-muted-foreground">Additional Profile Info</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </summary>
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                                        {q.data.additional?.name?.split(" ").map((n: string) => n[0]).join("")}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium leading-none">{q.data.additional?.name}</div>
                                        <div className="text-xs text-muted-foreground break-words">{q.data.additional?.email}</div>
                                    </div>
                                </div>
                            </details>

                            
                            <section className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg border p-4 space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                                    <p className="text-sm break-words">{q.data.email}</p>
                                    <p className="text-sm">{q.data.company ?? "-"}</p>
                                </div>
                                <div className="rounded-lg border p-4 space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Campaign</h3>
                                    <p className="text-sm">{q.data.campaignName}</p>
                                </div>
                            </section>

                            {/* Actions */}
                            <section className="rounded-lg border p-4">
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button className="text-sm rounded-md px-3 py-1.5 border hover:bg-accent">Contact</button>
                                    <button className="text-sm rounded-md px-3 py-1.5 border hover:bg-accent" onClick={() => onOpenChange(false)}>Close</button>
                                </div>
                            </section>
                            <section className="rounded-lg border p-4">
                                <h3 className=" text-sm font-medium text-muted-foreground mb-10 ">Activity Timeline</h3>
                                <motion.ul style={{ y }} className="space-y-3 relative">
                                    <span className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                                    {q.data.actions?.map((a: any, i: number) => (
                                        <motion.li key={i}
                                            initial={{ opacity: 0, x: 8 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-20%" }}
                                            transition={{ duration: 0.2, delay: i * 0.05 }}
                                            className="relative rounded-md border p-3 pl-10 text-sm">
                                            <span className={`absolute left-1.5 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full border ${i===0?"bg-blue-500/10 text-blue-600 border-blue-200":"bg-muted text-muted-foreground"}`}>
                                                {i===0 ? (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                ) : (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                                )}
                                            </span>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="font-medium truncate">{a.title}</div>
                                                {a.time && <div className="text-[11px] text-muted-foreground whitespace-nowrap">{a.time}</div>}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1 break-words">{a.description}</div>
                                            <button className="mt-2 text-[11px] text-blue-600 hover:underline">See More</button>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </section>
                        </div>
                    )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </Dialog.Portal>
        </Dialog.Root>
    );
}


