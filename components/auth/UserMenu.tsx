"use client";

import { authClient } from "@/lib/auth/client";
import { useQuery } from "@tanstack/react-query";

export default function UserMenu() {
	const me = useQuery({
		queryKey: ["me"],
		queryFn: async () => {
			const res = await fetch("/api/auth/session");
			if (!res.ok) return null;
			return res.json();
		},
	});

	return (
		<div className="flex items-center gap-3">
			{me.data?.user?.email && <span className="text-sm text-muted-foreground">{me.data.user.email}</span>}
			<button
				className="text-sm rounded-md px-3 py-1.5 hover:bg-accent"
				onClick={async () => {
					await authClient.signOut();
					window.location.href = "/login";
				}}
			>
				Logout
			</button>
		</div>
	);
}


