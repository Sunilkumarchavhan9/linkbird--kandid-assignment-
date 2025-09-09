import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql_query = neon(connectionString);
const db = drizzle(sql_query);

async function checkAccountsTable() {
  try {
    console.log("Checking accounts table structure...");
    
    // Get table info
    const result = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'accounts' 
      ORDER BY ordinal_position;
    `;
    
    console.log("Accounts table columns:");
    console.table(result);
    
  } catch (error) {
    console.error("Error checking accounts table:", error);
  }
}

checkAccountsTable();
