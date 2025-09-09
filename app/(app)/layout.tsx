import type { ReactNode } from "react";
import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-svh">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}


