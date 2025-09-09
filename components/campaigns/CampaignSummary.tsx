"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function CampaignSummary() {
    const me = useQuery<{ user?: { id: string } }>({
        queryKey: ["auth-session"],
        queryFn: async () => {
            const res = await fetch("/api/auth/session");
            if (!res.ok) return {} as any;
            return res.json();
        },
    });

    const userId = me.data?.user?.id;

    const q = useQuery<{ campaigns: number; totalLeads: number; successfulLeads: number; responseRate: number }>({
        queryKey: ["campaigns-summary", userId],
        queryFn: async () => {
            const url = userId ? `/api/campaigns/summary?userId=${encodeURIComponent(userId)}` : "/api/campaigns/summary";
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to load summary");
            return res.json();
        },
    });

    const data = q.data;
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
            <Card title="Campaigns" value={data?.campaigns ?? "-"} />
            <Card title="Total Leads" value={data?.totalLeads ?? "-"} />
            <Card title="Successful Leads" value={data?.successfulLeads ?? "-"} />
            <Card title="Response Rate" value={(data?.responseRate ?? 0) + "%"} />
        </motion.div>
    );
}

function Card({ title, value }: { title: string; value: string | number }) {
    return (
        <motion.div
            className="rounded-lg border p-4 bg-background/60 backdrop-blur"
            variants={{ hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
            whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}
        >
            <div className="text-xs text-muted-foreground">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </motion.div>
    );
}


