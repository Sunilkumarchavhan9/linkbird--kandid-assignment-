import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/db/schema";

const url = process.env.DATABASE_URL;
if (!url) {
    console.error("DATABASE_URL not set");
    process.exit(1);
}

const client = neon(url);
const db = drizzle(client, { schema });

async function main() {
    // Touch the DB to ensure connectivity; drizzly push still uses drizzle-kit CLI,
    // but we can at least verify HTTP connectivity and create enums/tables via SQL if needed.
    await db.execute("select 1");
    console.log("Connected via Neon HTTP");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


