import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql_query = neon(connectionString);
const db = drizzle(sql_query);

async function fixAccountsTable() {
  try {
    console.log("Adding missing columns to accounts table...");
    
    
    await sql`
      ALTER TABLE accounts 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    `;
    console.log("✓ Added created_at column");
    
    
    await sql`
      ALTER TABLE accounts 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    `;
    console.log("✓ Added updated_at column");
    
    console.log("Accounts table fixed!");
    
  } catch (error) {
    console.error("Error fixing accounts table:", error);
  }
}

fixAccountsTable();
