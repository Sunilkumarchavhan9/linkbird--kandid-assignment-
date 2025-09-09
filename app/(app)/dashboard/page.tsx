"use client";

import { BadgeCheck, Clock, Mail, User2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export default function DashboardPage() {
    const campaigns = [
        { name: "Just Herbs", status: "Active" },
        { name: "Juicy chemistry", status: "Active" },
        { name: "Hyugalife 2", status: "Active" },
        { name: "Honeyveda", status: "Active" },
        { name: "HempStreet", status: "Active" },
        { name: "HealthyHey 2", status: "Active" },
    ];

    const activities = [
        { name: "Om Satyarthy", role: "Regional Head", campaign: "Gynoveda", status: "Pending Approval" },
        { name: "Dr. Bhuvaneshwari", role: "Fertility & Women's Health", campaign: "Gynoveda", status: "Sent 7 mins ago" },
        { name: "Surdeep Singh", role: "Product-led SEO", campaign: "Gynoveda", status: "Sent 7 mins ago" },
        { name: "Dilbag Singh", role: "Marketing", campaign: "Gynoveda", status: "Sent 7 mins ago" },
        { name: "Vanshy Jain", role: "Ayurveda", campaign: "Gynoveda", status: "Sent 7 mins ago" },
        { name: "Sunil Pal", role: "Lifestyle", campaign: "Digi Sidekick", status: "Pending Approval" },
    ];

    const accounts = [
        { name: "Pulkit Garg", email: "pulkitgarg@gmail.com", status: "Connected", requests: 17, total: 30 },
        { name: "Jivesh Lakhani", email: "jivesh@gmail.com", status: "Connected", requests: 19, total: 30 },
        { name: "Indrajit Sahani", email: "indrajit38mj@gmail.com", status: "Connected", requests: 18, total: 30 },
        { name: "Bhavya Arora", email: "bhavya@kandid.ai", status: "Connected", requests: 18, total: 30 },
    ];

    const summary = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: async () => {
            const r = await fetch("/api/campaigns/summary");
            if (!r.ok) throw new Error("Failed to load summary");
            return r.json();
        },
    });
    const [campStatus, setCampStatus] = useState<string>("");
    const [campSort, setCampSort] = useState<"createdAt" | "name" | "successRate">("createdAt");
    const [campOrder, setCampOrder] = useState<"asc" | "desc">("desc");

    const campaignsQuery = useQuery({
        queryKey: ["dashboard-campaigns", campStatus, campSort, campOrder],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (campStatus) params.set("status", campStatus);
            params.set("sort", campSort);
            params.set("order", campOrder);
            const r = await fetch(`/api/campaigns?${params.toString()}`);
            if (!r.ok) throw new Error("Failed to load campaigns");
            return r.json();
        },
    });
    const campaignItems = (campaignsQuery.data as any)?.items?.slice(0, 6) ?? [];
    const [activityOrder, setActivityOrder] = useState<"recent" | "oldest">("recent");
    const activitiesSorted = useMemo(() => {
        return activityOrder === "recent" ? activities : [...activities].reverse();
    }, [activityOrder]);

    return (
        <div className="space-y-6 ">
            <div className="flex items-center justify-between">
                <h1 className="text-5xl font-semibold tracking-tight drop-shadow-lg bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent ">Dashboard</h1>
            </div>

            <motion.div className="grid gap-6 lg:grid-cols-2 " initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardHeader className="items-center justify-between ">
                        <CardTitle className="w-full flex items-center justify-between">
                            <span className="">Campaigns</span>
                            <div className="flex items-center gap-2">
                                <select className="h-8 rounded-md border bg-background px-2 text-xs" value={campStatus}
                                    onChange={(e) => setCampStatus(e.target.value)}>
                                    <option value="">All Campaigns</option>
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="draft">Draft</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <select className="h-8 rounded-md border bg-background px-2 text-xs" value={campSort}
                                    onChange={(e) => setCampSort(e.target.value as any)}>
                                    <option value="createdAt">Created</option>
                                    <option value="name">Name</option>
                                    <option value="successRate">Success Rate</option>
                                </select>
                                <select className="h-8 rounded-md border bg-background px-2 text-xs" value={campOrder}
                                    onChange={(e) => setCampOrder(e.target.value as any)}>
                                    <option value="desc">Desc</option>
                                    <option value="asc">Asc</option>
                                </select>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <Stat label="Campaigns" value={summary.data?.campaigns ?? "-"} />
                            <Stat label="Response Rate" value={(summary.data?.responseRate ?? 0) + "%"} />
                        </div>
                        <div className="divide-y">
                            {campaignItems.map((c: any, i: number) => (
                                <motion.div key={c.name} className="flex items-center justify-between py-3"
                                    initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                                    <span className="text-sm">{c.name}</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-700">
                                        <BadgeCheck className="h-3.5 w-3.5" /> {String(c.status).charAt(0).toUpperCase() + String(c.status).slice(1)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="items-center justify-between">
                        <CardTitle className="w-full flex items-center justify-between">
                            <span>Recent Activity</span>
                            <select className="h-8 rounded-md border bg-background px-2 text-xs" value={activityOrder}
                                onChange={(e) => setActivityOrder(e.target.value as any)}>
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {activitiesSorted.map((a, i) => (
                                <motion.div key={a.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3"
                                    initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }}>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <User2 className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium">{a.name}</div>
                                        <div className="truncate text-xs text-muted-foreground">{a.role}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="truncate text-xs text-muted-foreground">{a.campaign}</span>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-700">
                                            <Clock className="h-3 w-3" /> {a.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <Card>
                <CardHeader>
                    <CardTitle>LinkedIn Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {accounts.map((ac, i) => (
                            <motion.div key={ac.email} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 py-3 "
                                initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-medium">{ac.name}</div>
                                    <div className="truncate text-xs text-muted-foreground">{ac.email}</div>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-700">
                                    Connected
                                </span>
                                <div className="flex w-40 items-center gap-2">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                        <motion.div className="h-full rounded-full bg-blue-600" initial={{ width: 0 }} whileInView={{ width: `${Math.round((ac.requests / ac.total) * 100)}%` }} viewport={{ once: true }} />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{ac.requests}/{ac.total}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-xl font-semibold">{value}</div>
        </div>
    );
}


