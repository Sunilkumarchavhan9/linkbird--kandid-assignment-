"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(undefined);
		const res = await authClient.signUp.email({ name, email, password, callbackURL: "/dashboard" });
		if (res.error) setError(res.error.message);
		setLoading(false);
	}

	return (
		<div className="min-h-svh flex items-center justify-center p-6">
			<form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 rounded-xl border p-6">
				<h1 className="text-xl font-semibold">Create account</h1>
				<input className="h-10 w-full rounded-md border bg-background px-3 text-sm" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
				<input className="h-10 w-full rounded-md border bg-background px-3 text-sm" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input className="h-10 w-full rounded-md border bg-background px-3 text-sm" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button disabled={loading} className="w-full h-10 rounded-md bg-primary text-primary-foreground">
					{loading ? "Creating..." : "Sign up"}
				</button>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<p className="text-sm text-muted-foreground">Already have an account? <a className="underline" href="/login">Log in</a></p>
			</form>
		</div>
	);
}


