import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function addAccountsTimestamps() {
  try {
    console.log("Adding created_at and updated_at to accounts table...");
    
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`;
    console.log("✓ Added created_at column");
    
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`;
    console.log("✓ Added updated_at column");
    
    console.log("Accounts table fixed!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

addAccountsTimestamps();
