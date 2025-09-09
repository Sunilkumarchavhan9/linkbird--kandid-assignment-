"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import LeadDetailSheet from "@/components/leads/LeadDetailSheet";
import { Users, Mail, MessageSquare, Target, Calendar, LineChart } from "lucide-react";

export default function CampaignDetailPage() {
    const params = useParams<{ id: string }>();
    const id = Number(params?.id);

    const q = useQuery({
        queryKey: ["campaign", id],
        queryFn: async () => {
            const res = await fetch(`/api/campaigns/${id}`);
            if (!res.ok) throw new Error("Failed to load campaign");
            return res.json();
        },
        enabled: Number.isFinite(id),
    });

    const { scrollYProgress } = useScroll();
    const headerY = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

    const data: any = q.data ?? {};
    const [tab, setTab] = useState<"overview" | "leads" | "sequence" | "settings">("overview");

    return (
        <div className="space-y-6 top-10 ">
            <div className="relative overflow-hidden rounded-xl border">
                <motion.div style={{ y: headerY, opacity: headerOpacity }} className="p-6 sm:p-8">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>Campaign</span>
                        <span>›</span>
                        <span className="truncate max-w-[40ch]">{data.name ?? "Just Herbs"}</span>
                    </div>
                    <motion.h1 className=" text-2xl font-semibold tracking-tight mt-1" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        Campaign Details
                    </motion.h1>
                    <motion.div className="text-sm text-muted-foreground mt-1" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        Manage and track your campaign performance
                    </motion.div>
                    <div className="mt-4 flex items-center gap-4">
                        {[
                            { key: "overview", label: "Overview" },
                            { key: "leads", label: "Leads" },
                            { key: "sequence", label: "Sequence" },
                            { key: "settings", label: "Settings" },
                        ].map((t: any) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`relative text-sm px-1 pb-1 ${tab === t.key ? "text-foreground" : "text-muted-foreground"}`}
                            >
                                {t.label}
                                {tab === t.key && (
                                    <motion.span
                                        layoutId={`tab-underline-detail-${id}`}
                                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-primary"
                                    />
                                )}
                            </button>
                        ))}
                        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-green-500/10 text-green-700 text-xs px-2 py-0.5 capitalize">
                            ● {data.status ?? "active"}
                        </span>
                    </div>
                </motion.div>
                <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" style={{ y: useTransform(scrollYProgress, [0, 1], [0, -120]) }} />
            </div>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
                {[ 
                    { title: "Total Leads", value: data.totalLeads ?? 0, icon: <Users className="h-4 w-4" />, color: "text-blue-600 bg-blue-100" },
                    { title: "Request Sent", value: data.requestsSent ?? 0, icon: <Mail className="h-4 w-4" />, color: "text-purple-600 bg-purple-100" },
                    { title: "Request Accepted", value: data.requestsAccepted ?? 0, icon: <MessageSquare className="h-4 w-4" />, color: "text-amber-600 bg-amber-100" },
                    { title: "Request Replied", value: data.requestsReplied ?? 0, icon: <Target className="h-4 w-4" />, color: "text-green-600 bg-green-100" },
                ].map((k) => (
                    <motion.div key={k.title} className="rounded-lg border p-4 bg-background/60" variants={{ hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
                        <div className="flex items-start justify-between">
                            <div className="text-xs text-muted-foreground">{k.title}</div>
                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${k.color}`}>{k.icon}</span>
                        </div>
                        <div className="text-2xl font-semibold mt-1">{k.value}</div>
                    </motion.div>
                ))}
            </motion.div>

            {tab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <section className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Campaign Progress</h3>
                        {[
                            { label: "Leads Contacted", value: data.leadsContactedPct ?? 0 },
                            { label: "Acceptance Rate", value: data.acceptanceRate ?? 0 },
                            { label: "Reply Rate", value: data.replyRate ?? 0 },
                        ].map((row) => (
                            <div key={row.label} className="mb-3">
                                <div className="flex items-center justify-between text-xs mb-1"><span>{row.label}</span><span>{row.value}%</span></div>
                                <div className="h-2 rounded bg-muted">
                                    <motion.div className="h-2 rounded bg-primary" initial={{ width: 0 }} animate={{ width: `${row.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </section>
                    <section className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Campaign Details</h3>
                        <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-2"><span className="inline-flex h-5 w-5 items-center justify-center rounded text-sky-600 bg-sky-100"><Calendar className="h-3.5 w-3.5"/></span> Start Date: {data.startDate ? new Date(data.startDate).toLocaleDateString() : "-"}</li>
                            <li className="flex items-center gap-2"><span className="inline-flex h-5 w-5 items-center justify-center rounded text-violet-600 bg-violet-100"><LineChart className="h-3.5 w-3.5"/></span> Status: <span className="capitalize">{data.status ?? "-"}</span></li>
                            <li className="flex items-center gap-2"><span className="inline-flex h-5 w-5 items-center justify-center rounded text-emerald-600 bg-emerald-100"><Target className="h-3.5 w-3.5"/></span> Conversion Rate: {(data.conversionRate ?? 0) + "%"}</li>
                        </ul>
                    </section>
                </div>
            )}

            {tab === "leads" && (
                <section className="rounded-lg border overflow-hidden">
                    <div className="bg-muted/50 px-3 py-2 text-sm">Leads</div>
                    <LeadsList campaignId={id} />
                </section>
            )}

            {tab === "sequence" && (
                <div className="space-y-4">
                    <motion.section
                        className="rounded-xl border p-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="text-sm font-semibold">Message Sequence</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
                            <div className="rounded-lg border p-4">
                                <div className="text-sm font-medium mb-1">Request Message</div>
                                <p className="text-xs text-muted-foreground mb-3">Edit your request message here.</p>
                                <div className="rounded-md border bg-background p-3 text-xs space-y-2">
                                    <div><span className="text-primary">{'{{fullName}}'}</span> - Full Name</div>
                                    <div><span className="text-primary">{'{{firstName}}'}</span> - First Name</div>
                                    <div><span className="text-primary">{'{{lastName}}'}</span> - Last Name</div>
                                    <div><span className="text-primary">{'{{jobTitle}}'}</span> - Job Title</div>
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-medium">Message Template</div>
                                    <div className="flex items-center gap-2">
                                        <button className="rounded-md border px-2 py-1 text-xs hover:bg-accent">Preview</button>
                                        <button className="rounded-md bg-primary text-primary-foreground px-2 py-1 text-xs hover:opacity-90">Save</button>
                                    </div>
                                </div>
                                <div className="rounded-md border bg-background p-3 text-xs text-muted-foreground">
                                    Use {'{{field_name}}'} to insert mapped fields from your data.
                                </div>
                                <motion.textarea
                                    className="mt-3 w-full rounded-md border bg-background p-3 text-sm h-36"
                                    defaultValue={
                                        "Hi {{firstName}}, I'm building consultative AI salespersons for personal care brands with a guarantee to boost D2C revenue by min of 2%. Would love to connect if you're open to exploring this for {{campaignName}}!"
                                    }
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            </div>
                        </div>
                    </motion.section>

                    {["Connection Message", "First Follow-up Message", "Second Follow-up Message"].map((title, idx) => (
                        <motion.section
                            key={title}
                            className="rounded-xl border p-4"
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-15%" }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">{title}</div>
                                    <div className="text-xs text-muted-foreground">Edit your {title.toLowerCase()} here.</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-accent">Preview</button>
                                    <button className="rounded-md bg-primary text-primary-foreground px-2 py-1 text-xs hover:opacity-90">Save</button>
                                </div>
                            </div>
                            <motion.textarea
                                className="mt-3 w-full rounded-md border bg-background p-3 text-sm h-28"
                                defaultValue={
                                    idx === 0
                                        ? "Awesome to connect, {{firstName}}! Allow me to explain Kandid a bit..."
                                        : idx === 1
                                        ? "{{firstName}}, would you like to explore a POC for {{campaignName}}?"
                                        : "Hi {{firstName}}, just following up on my message..."
                                }
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                            />
                            <div className="mt-3 flex items-center gap-3 text-xs">
                                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">Send</span>
                                <select className="rounded-md border px-2 py-1 bg-background">
                                    <option>1 day</option>
                                    <option>2 days</option>
                                    <option>3 days</option>
                                </select>
                                <span className="text-muted-foreground">{idx === 0 ? "After Welcome Message" : idx === 1 ? "After First Follow-up" : "After Second Follow-up"}</span>
                            </div>
                        </motion.section>
                    ))}
                </div>
            )}

            {tab === "settings" && (
                <div className="space-y-4">
                    <motion.section
                        className="rounded-xl border p-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="text-sm font-semibold mb-3">Campaign Details</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Campaign Name</div>
                                <input className="w-full h-9 rounded-md border bg-background px-3 text-sm" defaultValue={data.name ?? "Untitled"} />
                            </div>
                            <div className="flex flex-wrap items-center gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" defaultChecked={data.status !== "paused"} className="h-4 w-4 rounded border" />
                                    Campaign Status
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border" />
                                    Request without personalization
                                </label>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        className="rounded-xl border p-4"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-15%" }}
                    >
                        <h3 className="text-sm font-semibold mb-2">AutoPilot Mode</h3>
                        <p className="text-xs text-muted-foreground mb-3">Let the system automatically manage LinkedIn account assignments</p>
                        <div className="flex items-center gap-2">
                            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">1 account selected</button>
                            <span className="text-xs text-muted-foreground">Selected Accounts:</span>
                            <span className="inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs">
                                <span className="h-5 w-5 rounded-full bg-muted" /> Jivesh Lakhani
                            </span>
                        </div>
                    </motion.section>

                    <motion.section
                        className="rounded-xl border p-4"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-15%" }}
                    >
                        <h3 className="text-sm font-semibold mb-2 text-red-600">Danger Zone</h3>
                        <p className="text-xs text-muted-foreground mb-3">Irreversible and destructive actions</p>
                        <div className="rounded-lg border p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">Delete Campaign</div>
                                    <div className="text-xs text-muted-foreground">Permanently delete this campaign and all associated data</div>
                                </div>
                                <button className="rounded-md bg-red-600 text-white px-3 py-1.5 text-sm hover:opacity-90">Delete Campaign</button>
                            </div>
                        </div>
                    </motion.section>
                </div>
            )}
        </div>
    );
}

function LeadsList({ campaignId }: { campaignId: number }) {
    const q = useInfiniteQuery({
        queryKey: ["campaign-leads", campaignId],
        initialPageParam: undefined as number | undefined,
        queryFn: async ({ pageParam }) => {
            const res = await fetch(`/api/leads?limit=50&campaignId=${campaignId}${pageParam ? `&cursor=${pageParam}` : ""}`);
            if (!res.ok) throw new Error("Failed to load leads");
            return res.json();
        },
        getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
    });
    const items = (q.data as any)?.pages?.flatMap((p: any) => p.items) ?? [];
    const [activeId, setActiveId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    return (
        <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left">
                        <th className="p-3">Name</th>
                        <th className="p-3">Lead Description</th>
                        <th className="p-3">Activity</th>
                        <th className="p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((l: any, i: number) => (
                        <motion.tr key={l.id}
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ delay: i * 0.01 }}
                            className="border-t hover:bg-accent/40 cursor-pointer"
                            onClick={() => { setActiveId(l.id); setOpen(true); }}
                        >
                            <td className="p-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-muted" />
                                    <div>{l.name}</div>
                                </div>
                            </td>
                            <td className="p-3 text-muted-foreground truncate max-w-[520px]">{l.company} — {l.email}</td>
                            <td className="p-3">
                                <div className="flex items-center gap-1 opacity-70">
                                    <span className="h-5 w-1.5 rounded bg-gray-300" />
                                    <span className="h-5 w-1.5 rounded bg-gray-300" />
                                    <span className="h-5 w-1.5 rounded bg-gray-300" />
                                </div>
                            </td>
                            <td className="p-3">
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 px-2 py-0.5 text-[11px]"><ClockDotIcon /> Pending</span>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
            <LeadDetailSheet id={activeId} open={open} onOpenChange={setOpen} />
        </div>
    );
}

function ClockDotIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    );
}


