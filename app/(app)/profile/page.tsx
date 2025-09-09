"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ProfilePage() {
    const me = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const p = await fetch("/api/profile").then(r => r.ok ? r.json() : null).catch(() => null);
            if (p?.user) return p;
            const res = await fetch("/api/auth/session");
            if (!res.ok) return { user: { name: "Bhavya From Kandid", email: "bhavya@kandid.ai" } } as any;
            return res.json();
        },
    });

    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

    const user = me.data?.user ?? { name: "Bhavya From Kandid", email: "bhavya@kandid.ai" };

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl border">
                <motion.div style={{ y, opacity }} className="p-6 sm:p-8">
                    <motion.h1 className="text-2xl font-semibold tracking-tight" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>Profile</motion.h1>
                    <motion.p className="text-sm text-muted-foreground mt-1" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>Manage your profile and account settings</motion.p>
                </motion.div>
                <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10" style={{ y: useTransform(scrollYProgress, [0, 1], [0, -120]) }} />
            </div>

            <motion.section className="rounded-xl border p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4">
                    <img src={user.image || "/sunil.jpg"} className="h-16 w-16 rounded-full object-cover" alt="avatar" />
                    <div className="min-w-0">
                        <div className="text-lg font-semibold truncate">{user.name ?? "-"}</div>
                        <div className="text-sm text-muted-foreground truncate">{user.email ?? "-"}</div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Display Name</div>
                        <input id="name" className="w-full h-9 rounded-md border bg-background px-3 text-sm" defaultValue={user.name ?? ""} />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Email</div>
                        <input id="email" className="w-full h-9 rounded-md border bg-background px-3 text-sm" defaultValue={user.email ?? ""} />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <button
                        className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm hover:opacity-90"
                        onClick={async () => {
                            const name = (document.getElementById("name") as HTMLInputElement)?.value;
                            const email = (document.getElementById("email") as HTMLInputElement)?.value;
                            await fetch("/api/profile", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email }) });
                            window.location.reload();
                        }}
                    >
                        Save Changes
                    </button>
                    <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">Cancel</button>
                </div>
            </motion.section>

            <motion.section className="rounded-xl border p-4" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }}>
                <h3 className="text-sm font-semibold mb-2">Security</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Password</div>
                        <input type="password" className="w-full h-9 rounded-md border bg-background px-3 text-sm" placeholder="••••••••" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Confirm Password</div>
                        <input type="password" className="w-full h-9 rounded-md border bg-background px-3 text-sm" placeholder="••••••••" />
                    </div>
                </div>
                <div className="mt-3">
                    <button className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm hover:opacity-90">Update Password</button>
                </div>
            </motion.section>
        </div>
    );
}


