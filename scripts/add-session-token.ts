import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

async function addSessionToken() {
  try {
    console.log("Adding token column to sessions table...");
    
    await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS token TEXT NOT NULL DEFAULT ''`;
    console.log("✓ Added token column to sessions table");
    
    console.log("Sessions table fixed!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

addSessionToken();
