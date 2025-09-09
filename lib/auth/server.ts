import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";
import * as authSchema from "@/lib/db/auth-schema";

function resolveBaseURL() {
	return (
		process.env.BETTER_AUTH_URL ||
		process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
		(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
	);
}

function resolveSecret() {
	return process.env.BETTER_AUTH_SECRET || "dev-insecure-secret-change-me";
}

export const auth = betterAuth({
	baseURL: resolveBaseURL(),
	secret: resolveSecret(),
	trustedOrigins: [
		"http://localhost:3000",
		"https://localhost:3000",
		...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
		...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
	],
	database: process.env.DATABASE_URL ? drizzleAdapter(db, {
		provider: "pg",
		schema: authSchema,
	}) : undefined,
	emailAndPassword: {
		enabled: true,
	},
	oauth: {
		google: {
			enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
});
