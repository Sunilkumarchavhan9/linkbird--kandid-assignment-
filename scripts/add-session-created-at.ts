import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function addSessionCreatedAt() {
  try {
    console.log("Adding created_at column to sessions table...");
    
    await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`;
    console.log("✓ Added created_at column to sessions table");
    
    console.log("Sessions table fixed!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

addSessionCreatedAt();
