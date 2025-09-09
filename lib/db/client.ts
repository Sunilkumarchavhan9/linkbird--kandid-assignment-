import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";

const client = neon(process.env.DATABASE_URL || "postgresql://dummy:dummy@dummy:5432/dummy");
export const db = drizzle(client, { schema: { ...schema, ...authSchema } });


