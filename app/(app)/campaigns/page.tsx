"use client";

import CampaignsTable from "@/components/campaigns/CampaignsTable";
import CampaignSummary from "@/components/campaigns/CampaignSummary";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function CampaignsPage() {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({ target: headerRef, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

    return (
        <div className="space-y-6 ">
            <div ref={headerRef} className="relative overflow-hidden rounded-xl border">
                <motion.div style={{ y, opacity }} className="p-6 sm:p-8">
                    <motion.h1
                        className="text-5xl font-semibold tracking-tight "
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    >
                        <span className="inline-block bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent">Campaigns</span>
                    </motion.h1>
                    <motion.p
                        className="text-sm text-muted-foreground mt-1"
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.06 }}
                    >
                        Manage your campaigns and track their performance.
                    </motion.p>
                </motion.div>
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10"
                    style={{ y: useTransform(scrollYProgress, [0, 1], [0, -120]) }}
                />
            </div>

            <CampaignSummary />
            <CampaignsTable />
        </div>
    );
}


