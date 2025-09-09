"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(undefined);
        
        try {
            const res = await authClient.signIn.email({ email, password, callbackURL: "/dashboard" });
            if (res.error) {
                setError(res.error.message);
            } else if (res.data) {
                // Redirect to dashboard on success
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-svh flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border bg-background/60 backdrop:blur-md shadow-xl p-6">
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold font-mono bg-gradient-to-l from-blue-600 to-black dark:to-white bg-clip-text text-transparent">Continue with an account</h1>
                    <p className="text-sm text-muted-foreground">You must log in or register to continue.</p>
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        type="button"
                        className="w-full h-11 rounded-full border bg-card hover:bg-accent transition-colors flex items-center justify-center gap-2"
                        onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.92h5.46c-.24 1.26-1.48 3.7-5.46 3.7-3.28 0-5.96-2.7-5.96-6.02S8.72 5.78 12 5.78c1.86 0 3.12.8 3.84 1.5l2.62-2.52C16.8 3.06 14.6 2.2 12 2.2 6.92 2.2 2.8 6.32 2.8 11.4s4.12 9.2 9.2 9.2c5.3 0 8.8-3.72 8.8-8.96 0-.6-.06-1.06-.14-1.54z"/></svg>
                        <span className="text-sm font-medium">Continue with Google</span>
                    </button>

                    <form onSubmit={onSubmit} className="space-y-3">
                        <input className="h-11 w-full rounded-md border bg-background px-3 text-sm" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input className="h-11 w-full rounded-md border bg-background px-3 text-sm" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button disabled={loading} className="w-full h-11 rounded-full bg-primary text-primary-foreground">
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">New User? <a className="underline hover:decoration-blue-600 hover:text-white" href="/register">Create New Account</a></p>
                </div>
            </div>
        </div>
    );
}


