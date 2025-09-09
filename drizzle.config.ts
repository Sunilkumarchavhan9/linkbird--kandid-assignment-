import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
import type { Config } from "drizzle-kit";

export default {
    schema: ["./lib/db/schema.ts", "./lib/db/auth-schema.ts"],
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL ?? "",
    },
    verbose: true,
    strict: true,
} satisfies Config;


